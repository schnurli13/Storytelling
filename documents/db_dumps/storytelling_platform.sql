-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Dez 2015 um 00:44
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
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `page`
--

INSERT INTO `page` (`id`, `level`, `position`, `story`, `title`, `text`, `imageLink`, `NextPageID1`, `NextPageID2`, `NextPageID3`, `NextPageID4`, `OptionText1`, `OptionText2`, `OptionText3`, `OptionText4`) VALUES
(1, 3, 3, 1, 'Page1', 'Text1', 'Link1', 0, 0, 0, 0, 'Option1_1', 'Option1_2', 'Option1_3', 'Option1_4'),
(2, 3, 1, 1, 'Page2', 'Text2', 'Link2', 0, 0, 0, 0, 'Option2_1', 'Option2_2', 'Option2_3', 'Option2_4'),
(3, 1, 1, 1, 'Page3', 'Text3', 'Link3', 13, 4, 0, 0, 'Option3_1', 'Option3_2', 'Option3_3', 'Option3_4'),
(4, 2, 2, 1, 'Page4', 'Text4', 'Link4', 12, 6, 0, 0, 'Option4_1', 'Option4_2', 'Option4_3', 'Option4_4'),
(5, 2, 2, 1, 'Page5', 'Text5', 'Link5', 15, 16, 1, 20, 'Option5_1', 'Option5_2', 'Option5_3', 'Option5_4'),
(6, 3, 2, 1, 'Page6', 'Text6', 'Link6', 0, 0, 0, 0, 'Option6_1', 'Option6_2', 'Option6_3', 'Option6_4'),
(7, 2, 1, 1, 'Page7', 'Text7', 'Link7', 2, 17, 21, 0, 'Option7_1', 'Option7_2', 'Option7_3', 'Option7_4'),
(11, 3, 1, 1, 'Page11', 'Text11', 'Link11', 22, 0, 0, 0, 'Option11_1', 'Option11_2', 'Option11_3', 'Option11_4'),
(12, 3, 1, 1, 'Page12', 'Text12', 'Link12', 0, 0, 0, 0, 'Option12_1', 'Option12_2', 'Option12_3', 'Option12_4'),
(13, 2, 1, 1, 'Page13', 'Text13', 'Link13', 11, 18, 0, 0, 'Option13_1', 'Option13_2', 'Option13_3', 'Option13_4'),
(14, 1, 2, 1, 'Page14', 'Text14', 'Link14', 7, 5, 0, 0, 'Option14_1', 'Option14_2', 'Option14_3', 'Option14_4'),
(15, 3, 1, 1, 'Page15', 'Text15', 'Link15', 0, 0, 0, 0, 'Option15_1', 'Option15_2', 'Option15_3', 'Option15_4'),
(16, 3, 2, 1, 'Page16', 'Text16', 'Link16', 0, 0, 0, 0, 'Option16_1', 'Option16_2', 'Option16_3', 'Option16_4'),
(17, 3, 2, 1, 'Page17', 'Text17', 'Link17', 0, 0, 0, 0, 'Option17_1', 'Option17_2', 'Option17_3', 'Option17_4'),
(18, 3, 2, 1, 'Page18', 'Text18', 'Link18', 0, 0, 0, 0, 'Option18_1', 'Option18_2', 'Option18_3', 'Option18_4'),
(19, 0, 1, 1, 'Page19', 'Text19', 'Link19', 3, 14, 0, 0, 'Option19_1', 'Option19_2', 'Option19_3', 'Option19_4'),
(20, 3, 4, 1, 'Page20', 'Text20', 'Link20', 0, 0, 0, 0, 'Option20_1', 'Option20_2', 'Option20_3', 'Option20_4'),
(21, 3, 3, 1, 'Page21', 'Text21', 'Link21', 0, 0, 0, 0, 'Option21_1', 'Option21_2', 'Option21_3', 'Option21_4'),
(22, 4, 1, 1, 'Page22', 'Text22', 'Link22', 0, 0, 0, 0, 'Option22_1', 'Option22_2', 'Option22_3', 'Option22_4'),
(100, 0, 1, 2, 'Page100', 'Text100', 'Link100', 101, 0, 0, 0, 'Option1_100', 'Option2_100', 'Option3_100', 'Option4_100'),
(101, 1, 1, 2, 'Page101', 'Text101', 'Link101', 102, 103, 104, 105, 'Option101_1', 'Option101_2', 'Option101_3', 'Option101_4'),
(102, 2, 1, 2, 'Page102', 'Text102', 'Link102', 0, 0, 0, 0, 'Option102_1', 'Option102_2', 'Option102_3', 'Option102_4'),
(103, 2, 2, 2, 'Page103', 'Text103', 'Link103', 0, 0, 0, 0, 'Option103_1', 'Option103_2', 'Option103_3', 'Option103_4'),
(104, 2, 3, 2, 'Page104', 'Text104', 'Link104', 0, 0, 0, 0, 'Option104_1', 'Option104_2', 'Option104_3', 'Option104_4'),
(105, 2, 4, 2, 'Page105', 'Text105', 'Link105', 0, 0, 0, 0, 'Option105_1', 'Option105_2', 'Option105_3', 'Option105_4');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `profile_images`
--

CREATE TABLE IF NOT EXISTS `profile_images` (
`id` int(10) unsigned NOT NULL,
  `user` int(11) NOT NULL,
  `path` varchar(65) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `profile_images`
--

INSERT INTO `profile_images` (`id`, `user`, `path`) VALUES
(1, 0, '98fdjk34ic4whjm234htrop6bv86mehhj75hm05.jpg'),
(33, 6, '04b32aa179cf149ea01801fa2f5f6743a780539d.jpg'),
(34, 9, '59b6b2139bea5b90497ff757afe5c50583cf2777.jpg'),
(36, 33, '8fa2cb12eb2011a9517953440a34e8b75c93aa3b.jpg'),
(37, 33, '1301df60ffb96a91dd22d887c88b7995897c49fc.jpg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `story`
--

CREATE TABLE IF NOT EXISTS `story` (
`id` int(10) unsigned NOT NULL,
  `name` text COLLATE utf8_bin NOT NULL,
  `firstPage` int(11) NOT NULL,
  `hasImage` int(11) NOT NULL,
  `hasText` int(11) NOT NULL,
  `isPublished` int(11) NOT NULL,
  `user` int(11) unsigned NOT NULL,
  `img_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `story`
--

INSERT INTO `story` (`id`, `name`, `firstPage`, `hasImage`, `hasText`, `isPublished`, `user`, `img_id`) VALUES
(1, 'storyvonbabs', 1, 1, 1, 0, 9, 1),
(2, 'story2', 100, 1, 1, 0, 9, 1),
(3, 'testStory', 1, 1, 1, 1, 9, 1),
(10, 'DaveStory', 1, 1, 1, 1, 6, 2),
(11, 'AnotherStory', 1, 1, 1, 0, 6, 1);

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
(2, 'DaveStory', '3c1229063d240b5f8da3b6f54db2bc46580fb4.jpg');

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `tutorialDone`, `img_id`) VALUES
(5, 'user4', 'this@this', '3412c1deca4e4906de242864a4f00503a513e40e3085296069762c17b36f0cb5db8110c654b4d669', 0, 1),
(6, 'KasnocknDave', 'asd@asd', '4f0af52e186117baa2fc20bb5184e163eeea24f1169dd76995bc4b47b99c0e612930700a7a8e2117', 0, 33),
(7, 'user', 'user@user', 'bf769d64e0aa600c1126e724661548a40a4fea611c3add61d9d4cd4ff50268900e926055c27390bf', 0, 1),
(9, 'babs', 'barbara-sikora@gmx.at', '3399c8b7fe5404849ba48ad8bb52c27e1b57a4c67c4a8d09ca3762af61e59520943dc26494f8941b', 0, 34);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `page`
--
ALTER TABLE `page`
 ADD PRIMARY KEY (`id`), ADD KEY `storyidx` (`story`);

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
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=106;
--
-- AUTO_INCREMENT für Tabelle `profile_images`
--
ALTER TABLE `profile_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT für Tabelle `story`
--
ALTER TABLE `story`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT für Tabelle `story_images`
--
ALTER TABLE `story_images`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
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
