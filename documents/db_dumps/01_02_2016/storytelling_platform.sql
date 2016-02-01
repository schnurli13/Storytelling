-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Feb 2016 um 01:06
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
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `page`
--

INSERT INTO `page` (`id`, `level`, `position`, `story`, `title`, `text`, `imageLink`, `NextPageID1`, `NextPageID2`, `NextPageID3`, `NextPageID4`, `OptionText1`, `OptionText2`, `OptionText3`, `OptionText4`) VALUES
(19, 0, 1, 1, 'Die Geschichte beginnt', 'Text19', '1', 114, 135, 0, 0, 'oder so', 'So', '', ''),
(100, 0, 1, 2, 'Page100', 'Text100', '30', 152, 0, 0, 0, 'lÃ¶l', '', '', ''),
(111, 0, 1, 25, 'Your first page! YESSS', 'saugeil', '29', 141, 142, 0, 0, 'hier gehts lang', 'komm ran', '', ''),
(114, 1, 1, 1, 'Sie geht weiter', 'Text114', '1', 116, 115, 118, 119, 'Option114_1', '', '', ''),
(115, 2, 2, 1, '... und weiter', 'Text115', '1', 123, 124, 125, 126, 'Option115_1', '', '', ''),
(116, 2, 1, 1, '... und aus!', 'Text116', 'Link116', 117, 120, 121, 122, '', '', '', ''),
(117, 3, 1, 1, 'Page117', 'Text117', 'Link117', 0, 0, 0, 0, 'Option117_1', 'Option117_2', 'Option117_3', 'Option117_4'),
(118, 2, 3, 1, 'Page118', 'Text118', 'Link118', 127, 128, 129, 130, 'Option118_1', 'Option118_2', 'Option118_3', 'Option118_4'),
(119, 2, 4, 1, 'Sowas aber auch', 'Text119', 'Link119', 131, 132, 133, 134, 'Option119_1', 'Option119_2', 'Option119_3', 'Option119_4'),
(120, 3, 2, 1, 'Page120', 'Text120', 'Link120', 0, 0, 0, 0, 'Option120_1', 'Option120_2', 'Option120_3', 'Option120_4'),
(121, 3, 3, 1, 'Page121', 'Text121', 'Link121', 0, 0, 0, 0, 'Option121_1', 'Option121_2', 'Option121_3', 'Option121_4'),
(122, 3, 4, 1, 'Page122', 'Text122', 'Link122', 0, 0, 0, 0, 'Option122_1', 'Option122_2', 'Option122_3', 'Option122_4'),
(123, 3, 1, 1, 'Page123', 'Text123', 'Link123', 0, 0, 0, 0, 'Option123_1', 'Option123_2', 'Option123_3', 'Option123_4'),
(124, 3, 2, 1, 'Page124', 'Text124', 'Link124', 0, 0, 0, 0, 'Option124_1', 'Option124_2', 'Option124_3', 'Option124_4'),
(125, 3, 3, 1, 'Page125', 'Text125', 'Link125', 0, 0, 0, 0, 'Option125_1', 'Option125_2', 'Option125_3', 'Option125_4'),
(126, 3, 4, 1, 'Page126', 'Text126', 'Link126', 0, 0, 0, 0, 'Option126_1', 'Option126_2', 'Option126_3', 'Option126_4'),
(127, 3, 1, 1, 'Page127', 'Text127', 'Link127', 0, 0, 0, 0, 'Option127_1', 'Option127_2', 'Option127_3', 'Option127_4'),
(128, 3, 2, 1, 'Page128', 'Text128', 'Link128', 0, 0, 0, 0, 'Option128_1', 'Option128_2', 'Option128_3', 'Option128_4'),
(129, 3, 3, 1, 'Page129', 'Text129', 'Link129', 0, 0, 0, 0, 'Option129_1', 'Option129_2', 'Option129_3', 'Option129_4'),
(130, 3, 4, 1, 'Page130', 'Text130', 'Link130', 0, 0, 0, 0, 'Option130_1', 'Option130_2', 'Option130_3', 'Option130_4'),
(131, 3, 1, 1, 'Page131', 'Text131', 'Link131', 0, 0, 0, 0, 'Option131_1', 'Option131_2', 'Option131_3', 'Option131_4'),
(132, 3, 2, 1, 'Page132', 'Text132', 'Link132', 0, 0, 0, 0, 'Option132_1', 'Option132_2', 'Option132_3', 'Option132_4'),
(133, 3, 3, 1, 'Page133', 'Text133', 'Link133', 0, 0, 0, 0, 'Option133_1', 'Option133_2', 'Option133_3', 'Option133_4'),
(134, 3, 4, 1, 'Page134', 'Text134', 'Link134', 0, 0, 0, 0, 'Option134_1', 'Option134_2', 'Option134_3', 'Option134_4'),
(135, 1, 2, 1, 'Page135', 'Text135', 'Link135', 136, 138, 0, 0, 'Option135_1', 'Option135_2', 'Option135_3', 'Option135_4'),
(136, 2, 1, 1, 'Page136', 'Text136', 'Link136', 137, 0, 0, 0, 'Option136_1', 'Option136_2', 'Option136_3', 'Option136_4'),
(137, 3, 1, 1, 'Page137', 'Text135', 'Link137', 0, 0, 0, 0, '', '', '', ''),
(138, 2, 2, 1, 'Page138', 'Text138', 'Link138', 0, 0, 0, 0, 'Option138_1', 'Option138_2', 'Option138_3', 'Option138_4'),
(139, 0, 1, 26, 'Your first page!', '', '', 0, 0, 0, 0, '', '', '', ''),
(140, 0, 1, 27, 'Your first page!', '', '', 0, 0, 0, 0, '', '', '', ''),
(141, 1, 1, 25, 'New page', 'hello', '28', 0, 0, 0, 0, '', '', '', ''),
(142, 1, 2, 25, 'das ist auch a mÃ¶glichkeit', '', '27', 0, 0, 0, 0, '', '', '', ''),
(143, 0, 1, 28, 'Your first page!', '', '', 144, 145, 0, 0, '', '', '', ''),
(144, 1, 1, 28, 'Default Title', '', '', 0, 0, 0, 0, '', '', '', ''),
(145, 1, 2, 28, 'Default Title', '', '', 146, 0, 0, 0, '', '', '', ''),
(146, 2, 1, 28, 'Default Title', '', '', 0, 0, 0, 0, '', '', '', ''),
(147, 0, 1, 29, 'Your first page!', '', '', 0, 0, 0, 0, '', '', '', ''),
(148, 0, 1, 30, 'Your first page!', '', '', 149, 150, 151, 0, 'un', 'dos', 'tres', ''),
(149, 1, 1, 30, 'un', 'hi', '', 0, 0, 0, 0, '', '', '', ''),
(150, 1, 2, 30, 'Default Title', '', '', 0, 0, 0, 0, '', '', '', ''),
(151, 1, 3, 30, 'Default Title', '', '', 0, 0, 0, 0, '', '', '', ''),
(152, 1, 1, 2, 'lel', '', '', 0, 0, 0, 0, '', '', '', ''),
(153, 0, 1, 31, 'Your first page!', '', '', 0, 0, 0, 0, '', '', '', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `page_images`
--

CREATE TABLE IF NOT EXISTS `page_images` (
`id` int(10) unsigned NOT NULL,
  `page` int(11) NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `page_images`
--

INSERT INTO `page_images` (`id`, `page`, `path`) VALUES
(1, 0, 'abcdefghijk.jpg'),
(3, 0, '49f34d71f535a0b672ff51e72b55d7e36ff8b637.jpeg'),
(25, 111, 'bf766af160f326914d2821baf1188a4d3e666615.jpeg'),
(26, 142, 'e1d8b03e9f791dd36363e686ca95c9d789192d3b.jpeg'),
(27, 142, '6d0b093e5a353c8787ae5b13827538541cd7d4eb.jpeg'),
(28, 141, 'f3cd5e9c9c49edc6718a4fd0d5f004d03d4e166e.jpeg'),
(29, 111, '1ca84106481cfb25d34fda6f3b1f0c357588ace3.jpeg'),
(30, 100, 'c278b456d359227bd17194e44644546bdd25edc9.jpeg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile_images`
--

CREATE TABLE IF NOT EXISTS `profile_images` (
`id` int(10) unsigned NOT NULL,
  `user` int(11) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `profile_images`
--

INSERT INTO `profile_images` (`id`, `user`, `path`) VALUES
(1, 0, '98fdjk34ic4whjm234htrop6bv86mehhj75hm05.jpg'),
(34, 9, '59b6b2139bea5b90497ff757afe5c50583cf2777.jpg'),
(36, 33, '8fa2cb12eb2011a9517953440a34e8b75c93aa3b.jpg'),
(37, 33, '1301df60ffb96a91dd22d887c88b7995897c49fc.jpg'),
(47, 9, 'c28e1729f3da9bb7b18996086cf75dd4e22770fe.png'),
(48, 6, '9f6cd733dc44db959ac86f68c98fe9e469953729.jpeg'),
(49, 6, 'adfda98e5a005022334d8ce89fdf0eb775ac5224.jpeg');

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

--
-- Daten für Tabelle `story`
--

INSERT INTO `story` (`id`, `name`, `author_name`, `co_author_name`, `firstPage`, `hasImage`, `hasText`, `isPublished`, `user`, `img_id`) VALUES
(1, 'storyvonbabs', 'asd', '', 1, 1, 1, 1, 9, 9),
(2, 'story2', '', '', 100, 1, 1, 1, 9, 13),
(3, 'testStory', '', '', 1, 1, 1, 1, 9, 1),
(10, 'DaveStory', '', '', 1, 1, 1, 1, 6, 1),
(11, 'AnotherStory', '', '', 1, 1, 1, 0, 6, 1),
(25, 'myteststory', 'ich', 'du', 111, 1, 1, 1, 6, 16),
(26, 'lÃ¶m', '', '', 139, 1, 1, 0, 9, 1),
(27, 'klarischguate', '', '', 140, 1, 1, 0, 9, 1),
(28, 'halloStory', '', '', 143, 1, 1, 0, 6, 1),
(29, 'asd', '', '', 147, 1, 1, 0, 9, 1),
(30, 'hi', '', '', 148, 1, 1, 0, 9, 1),
(31, 'testStorydas', '', '', 153, 1, 1, 1, 21, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `story_images`
--

CREATE TABLE IF NOT EXISTS `story_images` (
`id` int(10) unsigned NOT NULL,
  `story` varchar(65) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `story_images`
--

INSERT INTO `story_images` (`id`, `story`, `path`) VALUES
(1, 'f4gOXPxlUF', '84jg73kgnb549854nivnitgh9854nirthn023984.jpg'),
(2, 'DaveStory', '3c1229063d240b5f8da3b6f54db2bc46580fb4.jpg'),
(9, 'storyvonbabs', '4bfdfb0cb0bb8188317f7ce4551143c2db5b961d.jpeg'),
(12, 'storyvonbabs', '7a69fe5a51b31037413e609bffa2683d254c5bf5.jpeg'),
(13, 'story2', 'bf72df99b6287dfb0c5e2427f599b232b9e70d71.jpeg'),
(15, 'myteststory', 'f796b5bf277d2cc3dd907b2b39277247ca9438fd.jpeg'),
(16, 'myteststory', 'a5ef85e66638ec7174b5f137cf17a8d9acd9abf5.jpeg'),
(17, 'myteststory', '7b45d1b4cab091987b004dc7b573465f0da619bb.jpeg');

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
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `tutorialDone`, `img_id`) VALUES
(5, 'user4', 'this@this', '3412c1deca4e4906de242864a4f00503a513e40e3085296069762c17b36f0cb5db8110c654b4d669', 0, 1),
(6, 'KasnocknDave', 'this@that', '4f0af52e186117baa2fc20bb5184e163eeea24f1169dd76995bc4b47b99c0e612930700a7a8e2117', 0, 48),
(7, 'user', 'user@user', 'bf769d64e0aa600c1126e724661548a40a4fea611c3add61d9d4cd4ff50268900e926055c27390bf', 0, 1),
(9, 'babs', 'barbara-sikora@gmx.at', '3399c8b7fe5404849ba48ad8bb52c27e1b57a4c67c4a8d09ca3762af61e59520943dc26494f8941b', 0, 34),
(21, 'dasda', 'asd@sdf', '34da0d5f2ad304e3f02567bf1919ef6a19194c48c7a9f84bb5ac28e434238294999c298637e77cce', 0, 1);

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
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=154;
--
-- AUTO_INCREMENT für Tabelle `page_images`
--
ALTER TABLE `page_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
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
