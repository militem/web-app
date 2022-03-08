-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-03-2022 a las 05:01:38
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gym-system`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membership`
--

CREATE TABLE `membership` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `days` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `membership`
--

INSERT INTO `membership` (`id`, `name`, `days`, `price`) VALUES
(1, 'Diario', 1, '3.50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `CID` varchar(10) NOT NULL,
  `password` varchar(32) NOT NULL,
  `names` varchar(50) NOT NULL,
  `last_names` varchar(50) NOT NULL,
  `date_of_born` date NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `email` varchar(60) NOT NULL,
  `note` longtext NOT NULL,
  `medical_history` longtext NOT NULL,
  `membership` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`CID`, `password`, `names`, `last_names`, `date_of_born`, `phone_number`, `email`, `note`, `medical_history`, `membership`) VALUES
('0756565656', '25f9e794323b453885f5181f1b624d0b', 'Socio', 'Socio', '1994-05-18', '0988988989', 'socio@gmail.com', 'Notas adicionales', 'Historial patológico', 'Diario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_name` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date_of_creation` date NOT NULL DEFAULT current_timestamp(),
  `rol` varchar(10) NOT NULL,
  `state` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_name`, `password`, `name`, `date_of_creation`, `rol`, `state`) VALUES
('admin', '25f9e794323b453885f5181f1b624d0b', 'Admin', '0000-00-00', 'Admin', 'Habilitado'),
('user_test123', '25f9e794323b453885f5181f1b624d0b', 'User', '2022-03-04', 'Usuario', 'Habilitado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`CID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `membership`
--
ALTER TABLE `membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
