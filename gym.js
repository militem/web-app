//RUTA DE LA API
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mysqlConnection = require('../database');
//OBTENER FECHA ACTUAL
const hoy = new Date();

function formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }
    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}
//Se devuelven todos usuarios
router.get('/api/users', (req, res) => {
    const token = req.headers['token'];
    var valid = false
    var user_name = ''
        //Se verifica que el token enviado sea el correcto
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        user_name = user.user_name
        valid = true
    });
    if (valid) {
        mysqlConnection.query('SELECT user_name, name, Date_format(date_of_creation, "%M %d de %Y") AS date_of_creation, rol, state FROM users WHERE user_name <> ?', [user_name], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK',
                    rows: rows
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
//Se inserta un usuario
router.post('/api/useradd/', (req, res) => {
    const { user_name, password, name, rol } = req.body;
    const token = req.headers['token'];
    var date_of_creation = formatoFecha(hoy, 'yy/mm/dd');
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        mysqlConnection.query('INSERT INTO users VALUES(?, MD5(?), ?, ?, ?, "Habilitado")', [user_name, password, name, date_of_creation, rol], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK'
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
//Se actualiza los datos de un usuario
router.post('/api/userupdate/', (req, res) => {
    const { user_name, name, rol, state } = req.body;
    //console.log(user_name);
    const token = req.headers['token'];
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        mysqlConnection.query('UPDATE users SET name = ?, rol = ?, state = ? WHERE user_name = ?', [name, rol, state, user_name], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK'
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
//Se borra un usuario especifico
router.get('/api/userdelete/:user_name', (req, res) => {
    const { user_name } = req.params;
    const token = req.headers['token'];
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        mysqlConnection.query('DELETE FROM users WHERE user_name = ?', [user_name], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK'
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
//Autenticar las credenciales para el login
router.post('/api/auth/', (req, res) => {
    const { user_name, password } = req.body
    let token = jwt.sign({ user_name }, 'gym-system-back', { expiresIn: '24h' });
    mysqlConnection.query('SELECT name FROM users WHERE user_name = ? AND password = MD5(?) AND state = "Habilitado"', [user_name, password], (err, rows, fields) => {
        if (!err) {
            result = {
                token: token,
                msg: 'OK',
                rows: rows
            }
            res.json(result);
        } else {
            result = {
                msg: 'error'
            }
            res.json(result);
            console.log(err);
        }
    });
});
//Validar privilegios del usuario logeado
router.get('/api/validprivilege/', (req, res) => {
    const token = req.headers['token'];
    var valid = false
    var user_name = ''
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        user_name = user.user_name
        valid = true
    });
    if (valid) {
        mysqlConnection.query('SELECT rol FROM users WHERE user_name = ?', [user_name], (err, rows, fields) => {
            if (!err) {
                result = {
                    token: token,
                    msg: 'OK',
                    rows: rows
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
/*
    FUNCIONAMIENTO DE LA VISTA SOCIOS
*/
//OBTENER LOS DATOS DE LOS SOCIOS
router.get('/api/partners/', (req, res) => {
    const token = req.headers['token'];
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        mysqlConnection.query('SELECT CID, names, last_names, Date_format(date_of_born, "%M %d de %Y") AS date_of_born, phone_number, email, note, medical_history FROM socios', (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK',
                    rows: rows
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
});
//AÑADIR UN SOCIO EN LA BASE DE DATOS
router.post('/api/addpartner/', (req, res) => {
        const { CID, password, names, last_names, date_of_born, phone_number, email, note, medical_history } = req.body;
        const token = req.headers['token'];
        var valid = false
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, 'gym-system-back', (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            valid = true
        });
        if (valid) {
            mysqlConnection.query('INSERT INTO socios VALUES(?, MD5(?), ?, ?, ?, ?, ?, ?, ?)', [CID, password, names, last_names, date_of_born, phone_number, email, note, medical_history], (err, rows, fields) => {
                if (!err) {
                    result = {
                        msg: 'OK'
                    }
                    res.json(result);
                } else {
                    result = {
                        msg: 'error'
                    }
                    res.json(result);
                    console.log(err);
                }
            });
        }
    })
    //OBTENER LAS MEMBRESIAS DISPONIBLES PARA MOSTRAR EN EL SELECT DE LA VISTA SOCIOS 
router.get('/api/membershipsToPartners/', (req, res) => {
        const token = req.headers['token'];
        var valid = false
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, 'gym-system-back', (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            valid = true
        });
        if (valid) {
            mysqlConnection.query('SELECT * FROM membership', (err, rows, fields) => {
                if (!err) {
                    result = {
                        msg: 'OK',
                        rows: rows
                    }
                    res.json(result);
                } else {
                    result = {
                        msg: 'error'
                    }
                    res.json(result);
                    console.log(err);
                }
            });
        }
    })
    //OBTENER LAS MEMBRESIAS
router.get('/api/memberships/', (req, res) => {
        const token = req.headers['token'];
        var valid = false
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, 'gym-system-back', (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            valid = true
        });
        if (valid) {
            mysqlConnection.query('SELECT * FROM membership', (err, rows, fields) => {
                if (!err) {
                    result = {
                        msg: 'OK',
                        rows: rows
                    }
                    res.json(result);
                } else {
                    result = {
                        msg: 'error'
                    }
                    res.json(result);
                    console.log(err);
                }
            });
        }
    })
    //AÑADIR UN SOCIO EN LA BASE DE DATOS
router.post('/api/addmembership/', (req, res) => {
    const { name, days, price } = req.body;
    const token = req.headers['token'];
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        mysqlConnection.query('INSERT INTO membership VALUES(NULL, ?, ?, ?)', [name, days, price], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK'
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
})

//OBTENER PAGOS DE SOCIOS
router.get('/api/getPayments/', (req, res) => {
        const token = req.headers['token'];
        var valid = false
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, 'gym-system-back', (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            valid = true
        });
        if (valid) {
            mysqlConnection.query('SELECT * FROM sociospago', (err, rows, fields) => {
                if (!err) {
                    result = {
                        msg: 'OK',
                        rows: rows
                    }
                    res.json(result);
                } else {
                    result = {
                        msg: 'error'
                    }
                    res.json(result);
                    console.log(err);
                }
            });
        }
    })
    //OBTENER MEMBRESIAS DE CADA SOCIO
router.post('/api/getSocioMemberships/', (req, res) => {
        const { CID } = req.body;
        const token = req.headers['token'];
        var valid = false
        if (token == null) return res.sendStatus(403);
        jwt.verify(token, 'gym-system-back', (err, user) => {
            if (err) return res.sendStatus(404);
            req.user = user;
            valid = true
        });
        if (valid) {
            mysqlConnection.query('SELECT id_sociosMembership, days_consumed, state, Date_format(date_of_creation, "%M %d de %Y") AS date_of_creation FROM sociosmembership WHERE CID = ?', [CID], (err, rows, fields) => {
                if (!err) {
                    result = {
                        msg: 'OK',
                        rows: rows
                    }
                    res.json(result);
                } else {
                    result = {
                        msg: 'error'
                    }
                    res.json(result);
                    console.log(err);
                }
            });
        }
    })
    //AGREGAR MEMBRESIAS A CADA SOCIO
router.post('/api/addSocioMemberships/', (req, res) => {
    const { CID } = req.body;
    const token = req.headers['token'];
    var valid = false
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'gym-system-back', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        valid = true
    });
    if (valid) {
        //ME QUEDÉ AQUÍ DE LA API, FALTA TERMINAR EL INSERT
        mysqlConnection.query('INSERT INTO sociosmembership VALUES(NULL, ?, ?, ?, ?, ?)', [CID], (err, rows, fields) => {
            if (!err) {
                result = {
                    msg: 'OK',
                    rows: rows
                }
                res.json(result);
            } else {
                result = {
                    msg: 'error'
                }
                res.json(result);
                console.log(err);
            }
        });
    }
})

module.exports = router;