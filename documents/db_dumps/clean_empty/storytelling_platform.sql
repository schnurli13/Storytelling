-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Feb 2016 um 01:18
-- Server Version: 5.6.21
-- PHP-Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `storytelling_platform`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page`
--

CREATE TABLE IF NOT EXISTS `page` (
`id` int(10) unsigned NOT NULL,
  `level` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `story` int(11) unsigned NOT NULL,
  `title` text COLLATE utf8_bin NOT NULL,
  `text` text COLLATE utf8_bin NOT NULL,
  `imageLink` text COLLATE utf8_bin NOT NULL,
  `NextPageID1` int(11) NOT NULL,
  `NextPageID2` int(11) NOT NULL,
  `NextPageID3` int(11) NOT NULL,
  `NextPageID4` int(11) NOT NULL,
  `OptionText1` text COLLATE utf8_bin NOT NULL,
  `OptionText2` text COLLATE utf8_bin NOT NULL,
  `OptionText3` text COLLATE utf8_bin NOT NULL,
  `OptionText4` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_images`
--

CREATE TABLE IF NOT EXISTS `page_images` (
`id` int(10) unsigned NOT NULL,
  `page` int(11) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile_images`
--

CREATE TABLE IF NOT EXISTS `profile_images` (
`id` int(10) unsigned NOT NULL,
  `user` int(11) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `story`
--

CREATE TABLE IF NOT EXISTS `story` (
`id` int(10) unsigned NOT NULL,
  `name` text COLLATE utf8_bin NOT NULL,
  `author_name` text COLLATE utf8_bin NOT NULL,
  `co_author_name` text COLLATE utf8_bin NOT NULL,
  `firstPage` int(11) NOT NULL,
  `hasImage` int(11) NOT NULL,
  `hasText` int(11) NOT NULL,
  `isPublished` int(11) NOT NULL,
  `user` int(11) unsigned NOT NULL,
  `img_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `story_images`
--

CREATE TABLE IF NOT EXISTS `story_images` (
`id` int(10) unsigned NOT NULL,
  `story` varchar(65) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(10) unsigned NOT NULL,
  `name` text COLLATE utf8_bin NOT NULL,
  `email` text COLLATE utf8_bin NOT NULL,
  `password` text COLLATE utf8_bin NOT NULL,
  `tutorialDone` int(11) NOT NULL,
  `img_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `page`
--
ALTER TABLE `page`
 ADD PRIMARY KEY (`id`), ADD KEY `storyidx` (`story`);

--
-- Indizes für die Tabelle `page_images`
--
ALTER TABLE `page_images`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `profile_images`
--
ALTER TABLE `profile_images`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `story`
--
ALTER TABLE `story`
 ADD PRIMARY KEY (`id`), ADD KEY `useridx` (`user`), ADD KEY `img_id` (`img_id`);

--
-- Indizes für die Tabelle `story_images`
--
ALTER TABLE `story_images`
 ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD KEY `img_id` (`img_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `page`
--
ALTER TABLE `page`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `page_images`
--
ALTER TABLE `page_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `profile_images`
--
ALTER TABLE `profile_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT für Tabelle `story`
--
ALTER TABLE `story`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT für Tabelle `story_images`
--
ALTER TABLE `story_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `page`
--
ALTER TABLE `page`
ADD CONSTRAINT `page_ibfk_1` FOREIGN KEY (`story`) REFERENCES `story` (`id`);

--
-- Constraints der Tabelle `story`
--
ALTER TABLE `story`
ADD CONSTRAINT `story_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
ADD CONSTRAINT `story_ibfk_2` FOREIGN KEY (`img_id`) REFERENCES `story_images` (`id`);

--
-- Constraints der Tabelle `users`
--
ALTER TABLE `users`
ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`img_id`) REFERENCES `profile_images` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
