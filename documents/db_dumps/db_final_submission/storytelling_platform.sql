-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Feb 2016 um 11:45
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
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `page`
--

INSERT INTO `page` (`id`, `level`, `position`, `story`, `title`, `text`, `imageLink`, `NextPageID1`, `NextPageID2`, `NextPageID3`, `NextPageID4`, `OptionText1`, `OptionText2`, `OptionText3`, `OptionText4`) VALUES
(154, 0, 1, 32, 'Storytelling Tool', '', '2', 156, 0, 0, 0, 'Who we are', '', '', ''),
(155, 0, 1, 33, 'Your first page!', '', '', 0, 0, 0, 0, '', '', '', ''),
(156, 1, 1, 32, 'The Team', 'Eva Loidl, Barbara Sikora, David Hondl', '14', 157, 0, 0, 0, 'About the project', '', '', ''),
(157, 2, 1, 32, 'About Storii', 'What is it and how did it become our project?', '13', 158, 0, 0, 0, 'The topics', '', '', ''),
(158, 3, 1, 32, 'Our topics', 'What do you wanna see first?', '24', 159, 161, 160, 0, 'Frontend', 'Node-Editor', 'Backend', ''),
(159, 4, 1, 32, 'Frontend', 'Thanks for choosing the frontend! (Its the best part of this presentation anyway)', '12', 162, 0, 0, 0, 'COOL', '', '', ''),
(160, 4, 3, 32, 'Backend', 'Joke is on you! We still start with the frontend!', '3', 162, 0, 0, 0, 'NICE', '', '', ''),
(161, 4, 2, 32, 'Node-Editor', 'Joke is on you! We still start with the frontend!', '4', 162, 0, 0, 0, 'NICE', '', '', ''),
(162, 5, 1, 32, 'Frontend', 'Clean and simple, Scribble look, Colorful', '6', 163, 0, 0, 0, 'Moods', '', '', ''),
(163, 6, 1, 32, 'Moods', '', '7', 164, 0, 0, 0, 'Logo and mascot', '', '', ''),
(164, 7, 1, 32, 'Logo and Mascot', '', '8', 165, 0, 0, 0, 'Some designs', '', '', ''),
(165, 8, 1, 32, 'Design 1', 'Search and Register', '9', 166, 0, 0, 0, 'Next design', '', '', ''),
(166, 9, 1, 32, 'Design 2', 'Profile and Node editor', '10', 167, 0, 0, 0, 'Responsive Design', '', '', ''),
(167, 10, 1, 32, 'Responsive Design', 'Full responsive website and slide menu', '11', 168, 0, 0, 0, 'Next up: Node Editor!', '', '', ''),
(168, 11, 1, 32, 'Node Editor', 'This is the final node editor.', '5', 169, 0, 0, 0, 'Main functionality', '', '', ''),
(169, 12, 1, 32, 'Main functionality', 'Add and delete page.', '15', 170, 0, 0, 0, 'Exchanging functionality', '', '', ''),
(170, 13, 1, 32, 'Exchanging functionality', 'Exchange branches and single pages, add subpages.', '16', 171, 0, 0, 0, 'The special cases', '', '', ''),
(171, 14, 1, 32, 'Special cases', 'Reorder branches with parent node', '17', 181, 0, 0, 0, 'Additional functionality', '', '', ''),
(172, 16, 1, 32, 'Save values', 'Now they are save', '19', 173, 0, 0, 0, 'About konva', '', '', ''),
(173, 17, 1, 32, 'Konva', 'My conclusion. Would I use it again?', '20', 174, 175, 0, 0, 'Yes', 'No', '', ''),
(174, 18, 1, 32, 'It is not bad I guess', '', '21', 176, 0, 0, 0, 'Onwards!', '', '', ''),
(175, 18, 2, 32, 'Just kidding, it is nice', '', '22', 176, 0, 0, 0, 'Backend', '', '', ''),
(176, 19, 1, 32, 'The backend', 'Framework creation, Data bases, AJAX, AJAX, AJAX', '23', 177, 0, 0, 0, 'The framework', '', '', ''),
(177, 20, 1, 32, 'Framework', 'Wanna see some code?!', '25', 178, 0, 0, 0, 'But of course good sir!', '', '', ''),
(178, 21, 1, 32, 'URL-Mapping', 'This is how we map', '26', 180, 0, 0, 0, 'Controllers', '', '', ''),
(179, 23, 1, 32, 'The Data-Base', 'Structure of the data-base', '28', 182, 0, 0, 0, 'Thank you!', '', '', ''),
(180, 22, 1, 32, 'Controllers', 'Structure of the controller', '27', 179, 0, 0, 0, 'Data-Base', '', '', ''),
(181, 15, 1, 32, 'Additional functionality', 'Add connections between nodes', '18', 172, 0, 0, 0, 'Saving values', '', '', ''),
(182, 24, 1, 32, 'Default Title', '', '', 0, 0, 0, 0, '', '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_images`
--

CREATE TABLE IF NOT EXISTS `page_images` (
`id` int(10) unsigned NOT NULL,
  `page` int(11) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `page_images`
--

INSERT INTO `page_images` (`id`, `page`, `path`) VALUES
(1, 0, 'abcdefghijk.jpg'),
(2, 154, 'da99e00cccc7d27c7aef3a63c2a021edeef8837f.jpeg'),
(3, 160, 'c9d14395f6d103f54dc4a0bd97655a53cee7f4b2.png'),
(4, 161, 'bca6d0a54ca0a9fbb52246f3b80b1625cfc7527c.jpeg'),
(5, 168, 'f0bcac540a6c8c677e6329b1d1acfd47305cd92b.jpeg'),
(6, 162, 'c83fd5852d5a90d2ae0925d9f05caf9d7f28ce9f.jpeg'),
(7, 163, 'a1c94142e523e7ecad1086c8c9023a725b595e7f.jpeg'),
(8, 164, '7179e0fd980f1278d104e177b81cb70ee2877819.jpeg'),
(9, 165, '3f215ea29c2cd87463ae55f62e64cf2f5c9b9a15.jpeg'),
(10, 166, '11e5d3f547ccac0a65df2a41ca32655a789f1ea2.jpeg'),
(11, 167, '579dd23d3c7e210a6df30d56dc417e31f79d905c.jpeg'),
(12, 159, 'fdd0db719e0cc96ab129dcdc7f072ef8ee4b46eb.jpeg'),
(13, 157, '300de3a8bf03f6714899340c1a91c8a05ad9451e.jpeg'),
(14, 156, '32e80f4121056720ff08fde0c9e9e13c5c072782.jpeg'),
(15, 169, 'fe668a5df86b1b77479d7fb785ee36fac6a43778.jpeg'),
(16, 170, '1d8d2ba4e950acc139179fa97702c6eb4ca71798.jpeg'),
(17, 171, '040bbf1629e446c1a0592e329fc67a5ffde12a1d.jpeg'),
(18, 181, 'a7af62af3c9fe3834922b5f98ea1429fd74ff615.jpeg'),
(19, 172, '3f12291cd39869421dc5172e3a176ed32e715b92.jpeg'),
(20, 173, '2c7fdbda3035a134e60e412c2184ab9606021cdc.jpeg'),
(21, 174, 'f6340d2d58a625a41bb3616e9ed5f3f118b5d76d.jpeg'),
(22, 175, '7c144b83e6e9649f957d9ff88c143cf2f2ee863e.jpeg'),
(23, 176, '8e6e1c3926b72f25bfbf2e6b9c5b8035d0441a06.png'),
(24, 158, '7cd01c3a40639149d13fe96ac8fe6177f6407687.jpeg'),
(25, 177, '55e0026548601db392e52448fbd9ce7e39ade789.jpeg'),
(26, 178, 'ca8ea1d3e472e887ebe935e5a5f0013235f74b64.jpeg'),
(27, 180, '1af0010859c89a9167ba2b86a1318f97a2f8c7c9.png'),
(28, 179, '011f4f1248a5eff3d34acfad56dd56667cc4b7b5.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile_images`
--

CREATE TABLE IF NOT EXISTS `profile_images` (
`id` int(10) unsigned NOT NULL,
  `user` int(11) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `profile_images`
--

INSERT INTO `profile_images` (`id`, `user`, `path`) VALUES
(1, 0, '98fdjk34ic4whjm234htrop6bv86mehhj75hm05.jpg'),
(50, 22, 'ea8a85e02dfe653d207e8dba2b2779ede87f7baf.jpeg'),
(51, 23, 'ef9dab06270bcab2a2c58c02aeffc813b09168cd.jpeg'),
(52, 24, '3198e7a05467956fe1c3ed5e4664fd96ca98695c.jpeg');

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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `story`
--

INSERT INTO `story` (`id`, `name`, `author_name`, `co_author_name`, `firstPage`, `hasImage`, `hasText`, `isPublished`, `user`, `img_id`) VALUES
(32, 'Presentation', 'Team Storytelling', 'Martin Harrer (if he agrees)', 154, 1, 1, 1, 22, 2),
(33, 'barbaraStory', '', '', 155, 1, 1, 0, 23, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `story_images`
--

CREATE TABLE IF NOT EXISTS `story_images` (
`id` int(10) unsigned NOT NULL,
  `story` varchar(65) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `story_images`
--

INSERT INTO `story_images` (`id`, `story`, `path`) VALUES
(1, 'f4gOXPxlUF', '84jg73kgnb549854nivnitgh9854nirthn023984.jpg'),
(2, 'Presentation', '892da578d1a910869a395d648b34c31be2a868c5.jpeg');

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `tutorialDone`, `img_id`) VALUES
(22, 'David', 'david.hondl@gmx.net', '5dff15a5e6b19ea862f7709e9fe591ab35d001ef7bd1d89d9e5e4e91545766dd4be6189be0899365', 0, 50),
(23, 'Barbara', 'barbara-sikora@gmx.at', 'd02888a6c3c4a74dd26d63cfbd476dfe9cb0de079aa68f59fa39c99d1ac6296782ac64454ece35dc', 0, 51),
(24, 'EvaLoidl', 'eva.loidl@gmx.at', '7864b461702407d857b653f98e8b7ea053c07d899d1b816c19611e84725fc53607d94b9c62b3d390', 0, 52);

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
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=183;
--
-- AUTO_INCREMENT für Tabelle `page_images`
--
ALTER TABLE `page_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT für Tabelle `profile_images`
--
ALTER TABLE `profile_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=53;
--
-- AUTO_INCREMENT für Tabelle `story`
--
ALTER TABLE `story`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT für Tabelle `story_images`
--
ALTER TABLE `story_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
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
