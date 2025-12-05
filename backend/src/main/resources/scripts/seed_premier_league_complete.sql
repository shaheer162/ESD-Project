-- Sports Management System - Complete Premier League Data Seed Script
-- This script resets and populates the database with 10 Premier League teams, players, matches, and statistics
-- All matches are set to 2026-04-01

USE matchesdb;

-- Step 1: Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE match_player_stats;
TRUNCATE TABLE matches;
TRUNCATE TABLE player;
TRUNCATE TABLE team;
TRUNCATE TABLE stadium;
TRUNCATE TABLE division;
TRUNCATE TABLE city;
SET FOREIGN_KEY_CHECKS = 1;

-- Step 2: Insert Premier League Cities
INSERT INTO city (name) VALUES
('Manchester'), ('Liverpool'), ('London'), ('Newcastle'), ('Brighton'),
('Leicester'), ('Birmingham'), ('Southampton'), ('Leeds'), ('Sheffield');

-- Step 3: Insert Premier League Division
INSERT INTO division (name) VALUES
('Premier League');

-- Step 4: Insert Premier League Stadiums
INSERT INTO stadium (name, capacity) VALUES
('Old Trafford', 74310), ('Anfield', 53394), ('Stamford Bridge', 40341), 
('Emirates Stadium', 60704), ('Etihad Stadium', 53400),
('Tottenham Hotspur Stadium', 62850), ('St. James'' Park', 52305),
('Amex Stadium', 31800), ('King Power Stadium', 32312), ('Villa Park', 42682);

-- Step 5: Get IDs for reference
SET @premier_league = (SELECT id FROM division WHERE name = 'Premier League' LIMIT 1);

SET @manchester_city = (SELECT id FROM city WHERE name = 'Manchester' LIMIT 1);
SET @liverpool_city = (SELECT id FROM city WHERE name = 'Liverpool' LIMIT 1);
SET @london_city = (SELECT id FROM city WHERE name = 'London' LIMIT 1);
SET @newcastle_city = (SELECT id FROM city WHERE name = 'Newcastle' LIMIT 1);
SET @brighton_city = (SELECT id FROM city WHERE name = 'Brighton' LIMIT 1);
SET @leicester_city = (SELECT id FROM city WHERE name = 'Leicester' LIMIT 1);
SET @birmingham_city = (SELECT id FROM city WHERE name = 'Birmingham' LIMIT 1);
SET @southampton_city = (SELECT id FROM city WHERE name = 'Southampton' LIMIT 1);
SET @leeds_city = (SELECT id FROM city WHERE name = 'Leeds' LIMIT 1);
SET @sheffield_city = (SELECT id FROM city WHERE name = 'Sheffield' LIMIT 1);

SET @old_trafford = (SELECT id FROM stadium WHERE name = 'Old Trafford' LIMIT 1);
SET @anfield = (SELECT id FROM stadium WHERE name = 'Anfield' LIMIT 1);
SET @stamford_bridge = (SELECT id FROM stadium WHERE name = 'Stamford Bridge' LIMIT 1);
SET @emirates = (SELECT id FROM stadium WHERE name = 'Emirates Stadium' LIMIT 1);
SET @etihad = (SELECT id FROM stadium WHERE name = 'Etihad Stadium' LIMIT 1);
SET @tottenham = (SELECT id FROM stadium WHERE name = 'Tottenham Hotspur Stadium' LIMIT 1);
SET @st_james_park = (SELECT id FROM stadium WHERE name = 'St. James'' Park' LIMIT 1);
SET @amex = (SELECT id FROM stadium WHERE name = 'Amex Stadium' LIMIT 1);
SET @king_power = (SELECT id FROM stadium WHERE name = 'King Power Stadium' LIMIT 1);
SET @villa_park = (SELECT id FROM stadium WHERE name = 'Villa Park' LIMIT 1);

-- Step 6: Insert 10 Premier League Teams (password = username)
INSERT INTO team (name, username, password, email, division_id, city_id, stadium_id) VALUES
('Manchester United', 'manchesterunited', 'manchesterunited', 'manchesterunited@team.com', @premier_league, @manchester_city, @old_trafford),
('Liverpool FC', 'liverpoolfc', 'liverpoolfc', 'liverpoolfc@team.com', @premier_league, @liverpool_city, @anfield),
('Chelsea FC', 'chelseafc', 'chelseafc', 'chelseafc@team.com', @premier_league, @london_city, @stamford_bridge),
('Arsenal FC', 'arsenalfc', 'arsenalfc', 'arsenalfc@team.com', @premier_league, @london_city, @emirates),
('Manchester City', 'manchestercity', 'manchestercity', 'manchestercity@team.com', @premier_league, @manchester_city, @etihad),
('Tottenham Hotspur', 'tottenhamhotspur', 'tottenhamhotspur', 'tottenhamhotspur@team.com', @premier_league, @london_city, @tottenham),
('Newcastle United', 'newcastleunited', 'newcastleunited', 'newcastleunited@team.com', @premier_league, @newcastle_city, @st_james_park),
('Brighton & Hove Albion', 'brightonhovealbion', 'brightonhovealbion', 'brightonhovealbion@team.com', @premier_league, @brighton_city, @amex),
('Leicester City', 'leicestercity', 'leicestercity', 'leicestercity@team.com', @premier_league, @leicester_city, @king_power),
('Aston Villa', 'astonvilla', 'astonvilla', 'astonvilla@team.com', @premier_league, @birmingham_city, @villa_park);

-- Step 7: Get Team IDs
SET @manutd_id = (SELECT id FROM team WHERE username = 'manchesterunited' LIMIT 1);
SET @liverpool_id = (SELECT id FROM team WHERE username = 'liverpoolfc' LIMIT 1);
SET @chelsea_id = (SELECT id FROM team WHERE username = 'chelseafc' LIMIT 1);
SET @arsenal_id = (SELECT id FROM team WHERE username = 'arsenalfc' LIMIT 1);
SET @mancity_id = (SELECT id FROM team WHERE username = 'manchestercity' LIMIT 1);
SET @tottenham_id = (SELECT id FROM team WHERE username = 'tottenhamhotspur' LIMIT 1);
SET @newcastle_id = (SELECT id FROM team WHERE username = 'newcastleunited' LIMIT 1);
SET @brighton_id = (SELECT id FROM team WHERE username = 'brightonhovealbion' LIMIT 1);
SET @leicester_id = (SELECT id FROM team WHERE username = 'leicestercity' LIMIT 1);
SET @villa_id = (SELECT id FROM team WHERE username = 'astonvilla' LIMIT 1);

-- Step 8: Insert Players for Each Team (20-25 players per team)

-- Manchester United Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Andre Onana', 'Goalkeeper', 24, @manutd_id),
('Diogo Dalot', 'Defender', 20, @manutd_id),
('Raphael Varane', 'Defender', 19, @manutd_id),
('Lisandro Martinez', 'Defender', 6, @manutd_id),
('Luke Shaw', 'Defender', 23, @manutd_id),
('Casemiro', 'Midfielder', 18, @manutd_id),
('Bruno Fernandes', 'Midfielder', 8, @manutd_id),
('Christian Eriksen', 'Midfielder', 14, @manutd_id),
('Marcus Rashford', 'Forward', 10, @manutd_id),
('Rasmus Hojlund', 'Forward', 11, @manutd_id),
('Antony', 'Forward', 21, @manutd_id),
('Harry Maguire', 'Defender', 5, @manutd_id),
('Victor Lindelof', 'Defender', 2, @manutd_id),
('Scott McTominay', 'Midfielder', 39, @manutd_id),
('Mason Mount', 'Midfielder', 7, @manutd_id),
('Alejandro Garnacho', 'Forward', 17, @manutd_id),
('Anthony Martial', 'Forward', 9, @manutd_id),
('Aaron Wan-Bissaka', 'Defender', 29, @manutd_id),
('Tyrell Malacia', 'Defender', 12, @manutd_id),
('Kobbie Mainoo', 'Midfielder', 37, @manutd_id);

-- Liverpool FC Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Alisson Becker', 'Goalkeeper', 1, @liverpool_id),
('Trent Alexander-Arnold', 'Defender', 66, @liverpool_id),
('Virgil van Dijk', 'Defender', 4, @liverpool_id),
('Ibrahima Konate', 'Defender', 5, @liverpool_id),
('Andrew Robertson', 'Defender', 26, @liverpool_id),
('Alexis Mac Allister', 'Midfielder', 10, @liverpool_id),
('Dominik Szoboszlai', 'Midfielder', 8, @liverpool_id),
('Wataru Endo', 'Midfielder', 3, @liverpool_id),
('Mohamed Salah', 'Forward', 11, @liverpool_id),
('Darwin Nunez', 'Forward', 9, @liverpool_id),
('Luis Diaz', 'Forward', 7, @liverpool_id),
('Cody Gakpo', 'Forward', 18, @liverpool_id),
('Harvey Elliott', 'Midfielder', 19, @liverpool_id),
('Curtis Jones', 'Midfielder', 17, @liverpool_id),
('Joe Gomez', 'Defender', 2, @liverpool_id),
('Joel Matip', 'Defender', 32, @liverpool_id),
('Kostas Tsimikas', 'Defender', 21, @liverpool_id),
('Thiago Alcantara', 'Midfielder', 6, @liverpool_id),
('Stefan Bajcetic', 'Midfielder', 43, @liverpool_id),
('Caoimhin Kelleher', 'Goalkeeper', 62, @liverpool_id);

-- Chelsea FC Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Robert Sanchez', 'Goalkeeper', 1, @chelsea_id),
('Malo Gusto', 'Defender', 27, @chelsea_id),
('Thiago Silva', 'Defender', 6, @chelsea_id),
('Axel Disasi', 'Defender', 2, @chelsea_id),
('Ben Chilwell', 'Defender', 21, @chelsea_id),
('Enzo Fernandez', 'Midfielder', 8, @chelsea_id),
('Moises Caicedo', 'Midfielder', 25, @chelsea_id),
('Conor Gallagher', 'Midfielder', 23, @chelsea_id),
('Raheem Sterling', 'Forward', 7, @chelsea_id),
('Nicolas Jackson', 'Forward', 15, @chelsea_id),
('Cole Palmer', 'Forward', 20, @chelsea_id),
('Reece James', 'Defender', 24, @chelsea_id),
('Levi Colwill', 'Defender', 26, @chelsea_id),
('Mykhailo Mudryk', 'Forward', 10, @chelsea_id),
('Noni Madueke', 'Forward', 11, @chelsea_id),
('Lesley Ugochukwu', 'Midfielder', 16, @chelsea_id),
('Marc Cucurella', 'Defender', 3, @chelsea_id),
('Armando Broja', 'Forward', 19, @chelsea_id),
('Benoit Badiashile', 'Defender', 5, @chelsea_id),
('Marcus Bettinelli', 'Goalkeeper', 13, @chelsea_id);

-- Arsenal FC Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('David Raya', 'Goalkeeper', 22, @arsenal_id),
('Ben White', 'Defender', 4, @arsenal_id),
('William Saliba', 'Defender', 2, @arsenal_id),
('Gabriel Magalhaes', 'Defender', 6, @arsenal_id),
('Oleksandr Zinchenko', 'Defender', 35, @arsenal_id),
('Declan Rice', 'Midfielder', 41, @arsenal_id),
('Martin Odegaard', 'Midfielder', 8, @arsenal_id),
('Kai Havertz', 'Midfielder', 29, @arsenal_id),
('Bukayo Saka', 'Forward', 7, @arsenal_id),
('Gabriel Jesus', 'Forward', 9, @arsenal_id),
('Gabriel Martinelli', 'Forward', 11, @arsenal_id),
('Aaron Ramsdale', 'Goalkeeper', 1, @arsenal_id),
('Takehiro Tomiyasu', 'Defender', 18, @arsenal_id),
('Jorginho', 'Midfielder', 20, @arsenal_id),
('Leandro Trossard', 'Forward', 19, @arsenal_id),
('Eddie Nketiah', 'Forward', 14, @arsenal_id),
('Fabio Vieira', 'Midfielder', 21, @arsenal_id),
('Emile Smith Rowe', 'Midfielder', 10, @arsenal_id),
('Jakub Kiwior', 'Defender', 15, @arsenal_id),
('Reiss Nelson', 'Forward', 24, @arsenal_id);

-- Manchester City Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Ederson', 'Goalkeeper', 31, @mancity_id),
('Kyle Walker', 'Defender', 2, @mancity_id),
('Ruben Dias', 'Defender', 3, @mancity_id),
('John Stones', 'Defender', 5, @mancity_id),
('Josko Gvardiol', 'Defender', 24, @mancity_id),
('Rodri', 'Midfielder', 16, @mancity_id),
('Kevin De Bruyne', 'Midfielder', 17, @mancity_id),
('Bernardo Silva', 'Midfielder', 20, @mancity_id),
('Phil Foden', 'Forward', 47, @mancity_id),
('Erling Haaland', 'Forward', 9, @mancity_id),
('Julian Alvarez', 'Forward', 19, @mancity_id),
('Manuel Akanji', 'Defender', 25, @mancity_id),
('Nathan Ake', 'Defender', 6, @mancity_id),
('Mateo Kovacic', 'Midfielder', 8, @mancity_id),
('Jack Grealish', 'Forward', 10, @mancity_id),
('Jeremy Doku', 'Forward', 11, @mancity_id),
('Rico Lewis', 'Defender', 82, @mancity_id),
('Stefan Ortega', 'Goalkeeper', 18, @mancity_id),
('Scott Carson', 'Goalkeeper', 33, @mancity_id),
('Sergio Gomez', 'Defender', 21, @mancity_id);

-- Tottenham Hotspur Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Guglielmo Vicario', 'Goalkeeper', 13, @tottenham_id),
('Cristian Romero', 'Defender', 17, @tottenham_id),
('Micky van de Ven', 'Defender', 37, @tottenham_id),
('Pedro Porro', 'Defender', 23, @tottenham_id),
('Destiny Udogie', 'Defender', 38, @tottenham_id),
('Yves Bissouma', 'Midfielder', 8, @tottenham_id),
('Pape Matar Sarr', 'Midfielder', 29, @tottenham_id),
('James Maddison', 'Midfielder', 10, @tottenham_id),
('Son Heung-min', 'Forward', 7, @tottenham_id),
('Richarlison', 'Forward', 9, @tottenham_id),
('Dejan Kulusevski', 'Forward', 21, @tottenham_id),
('Fraser Forster', 'Goalkeeper', 20, @tottenham_id),
('Ben Davies', 'Defender', 33, @tottenham_id),
('Eric Dier', 'Defender', 15, @tottenham_id),
('Pierre-Emile Hojbjerg', 'Midfielder', 5, @tottenham_id),
('Rodrigo Bentancur', 'Midfielder', 30, @tottenham_id),
('Brennan Johnson', 'Forward', 22, @tottenham_id),
('Manor Solomon', 'Forward', 27, @tottenham_id),
('Emerson Royal', 'Defender', 12, @tottenham_id),
('Oliver Skipp', 'Midfielder', 4, @tottenham_id);

-- Newcastle United Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Nick Pope', 'Goalkeeper', 22, @newcastle_id),
('Kieran Trippier', 'Defender', 2, @newcastle_id),
('Fabian Schar', 'Defender', 5, @newcastle_id),
('Sven Botman', 'Defender', 4, @newcastle_id),
('Dan Burn', 'Defender', 33, @newcastle_id),
('Bruno Guimaraes', 'Midfielder', 39, @newcastle_id),
('Joelinton', 'Midfielder', 7, @newcastle_id),
('Sandro Tonali', 'Midfielder', 8, @newcastle_id),
('Alexander Isak', 'Forward', 14, @newcastle_id),
('Callum Wilson', 'Forward', 9, @newcastle_id),
('Anthony Gordon', 'Forward', 10, @newcastle_id),
('Miguel Almiron', 'Forward', 24, @newcastle_id),
('Sean Longstaff', 'Midfielder', 36, @newcastle_id),
('Harvey Barnes', 'Forward', 15, @newcastle_id),
('Jamaal Lascelles', 'Defender', 6, @newcastle_id),
('Matt Targett', 'Defender', 13, @newcastle_id),
('Lewis Hall', 'Defender', 21, @newcastle_id),
('Elliot Anderson', 'Midfielder', 32, @newcastle_id),
('Jacob Murphy', 'Forward', 23, @newcastle_id),
('Martin Dubravka', 'Goalkeeper', 1, @newcastle_id);

-- Brighton & Hove Albion Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Jason Steele', 'Goalkeeper', 23, @brighton_id),
('Tariq Lamptey', 'Defender', 2, @brighton_id),
('Lewis Dunk', 'Defender', 5, @brighton_id),
('Jan Paul van Hecke', 'Defender', 29, @brighton_id),
('Pervis Estupinan', 'Defender', 30, @brighton_id),
('Pascal Gross', 'Midfielder', 13, @brighton_id),
('Billy Gilmour', 'Midfielder', 11, @brighton_id),
('Solly March', 'Midfielder', 7, @brighton_id),
('Kaoru Mitoma', 'Forward', 22, @brighton_id),
('Evan Ferguson', 'Forward', 18, @brighton_id),
('Joao Pedro', 'Forward', 9, @brighton_id),
('Adam Lallana', 'Midfielder', 14, @brighton_id),
('Mahmoud Dahoud', 'Midfielder', 8, @brighton_id),
('Joel Veltman', 'Defender', 34, @brighton_id),
('Igor Julio', 'Defender', 4, @brighton_id),
('Ansu Fati', 'Forward', 31, @brighton_id),
('Danny Welbeck', 'Forward', 18, @brighton_id),
('Bart Verbruggen', 'Goalkeeper', 1, @brighton_id),
('Facundo Buonanotte', 'Midfielder', 40, @brighton_id),
('Julio Enciso', 'Forward', 10, @brighton_id);

-- Leicester City Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Danny Ward', 'Goalkeeper', 1, @leicester_id),
('Ricardo Pereira', 'Defender', 21, @leicester_id),
('Wout Faes', 'Defender', 3, @leicester_id),
('Jonny Evans', 'Defender', 6, @leicester_id),
('Timothy Castagne', 'Defender', 27, @leicester_id),
('Wilfred Ndidi', 'Midfielder', 25, @leicester_id),
('Youri Tielemans', 'Midfielder', 8, @leicester_id),
('James Maddison', 'Midfielder', 10, @leicester_id),
('Jamie Vardy', 'Forward', 9, @leicester_id),
('Patson Daka', 'Forward', 29, @leicester_id),
('Harvey Barnes', 'Forward', 7, @leicester_id),
('Kelechi Iheanacho', 'Forward', 14, @leicester_id),
('Boubakary Soumare', 'Midfielder', 42, @leicester_id),
('Nampalys Mendy', 'Midfielder', 24, @leicester_id),
('Daniel Amartey', 'Defender', 18, @leicester_id),
('Caglar Soyuncu', 'Defender', 4, @leicester_id),
('Luke Thomas', 'Defender', 33, @leicester_id),
('Ayoze Perez', 'Forward', 17, @leicester_id),
('Dennis Praet', 'Midfielder', 26, @leicester_id),
('Kasper Schmeichel', 'Goalkeeper', 1, @leicester_id);

-- Aston Villa Players (20 players)
INSERT INTO player (name, position, jersey_number, team_id) VALUES
('Emiliano Martinez', 'Goalkeeper', 1, @villa_id),
('Matty Cash', 'Defender', 2, @villa_id),
('Ezri Konsa', 'Defender', 4, @villa_id),
('Pau Torres', 'Defender', 14, @villa_id),
('Lucas Digne', 'Defender', 12, @villa_id),
('Douglas Luiz', 'Midfielder', 6, @villa_id),
('Boubacar Kamara', 'Midfielder', 44, @villa_id),
('John McGinn', 'Midfielder', 7, @villa_id),
('Leon Bailey', 'Forward', 31, @villa_id),
('Ollie Watkins', 'Forward', 11, @villa_id),
('Moussa Diaby', 'Forward', 19, @villa_id),
('Youri Tielemans', 'Midfielder', 8, @villa_id),
('Jacob Ramsey', 'Midfielder', 41, @villa_id),
('Tyrone Mings', 'Defender', 5, @villa_id),
('Calum Chambers', 'Defender', 16, @villa_id),
('Philippe Coutinho', 'Midfielder', 23, @villa_id),
('Jaden Philogene-Bidace', 'Forward', 27, @villa_id),
('Robin Olsen', 'Goalkeeper', 25, @villa_id),
('Diego Carlos', 'Defender', 3, @villa_id),
('Nicolo Zaniolo', 'Forward', 22, @villa_id);

-- Step 9: Insert Matches - Mix of Past (completed) and Upcoming (scheduled) matches
-- Past matches: dates in 2024 with scores (completed)
-- Upcoming matches: dates in 2026 with 0-0 scores (scheduled, not played yet)

-- PAST MATCHES (Completed - dates in 2024)
INSERT INTO matches (uuid, date, time, home_team_id, away_team_id, home_goals, away_goals, stadium_id) VALUES
-- Past matches for Manchester United
(UNHEX(REPLACE(UUID(), '-', '')), '2024-01-15', '15:00:00', @manutd_id, @liverpool_id, 2, 1, @old_trafford),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-02-10', '17:30:00', @manutd_id, @chelsea_id, 3, 0, @old_trafford),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-03-05', '16:00:00', @arsenal_id, @manutd_id, 2, 2, @emirates),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-03-20', '20:00:00', @manutd_id, @mancity_id, 1, 2, @old_trafford),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-04-01', '15:00:00', @manutd_id, @arsenal_id, 3, 1, @old_trafford),
-- Past matches for Liverpool
(UNHEX(REPLACE(UUID(), '-', '')), '2024-01-20', '15:00:00', @liverpool_id, @chelsea_id, 2, 0, @anfield),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-02-15', '17:00:00', @tottenham_id, @liverpool_id, 1, 3, @tottenham),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-03-10', '16:30:00', @liverpool_id, @arsenal_id, 1, 1, @anfield),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-04-05', '18:00:00', @liverpool_id, @tottenham_id, 2, 1, @anfield),
-- Past matches for other teams
(UNHEX(REPLACE(UUID(), '-', '')), '2024-01-25', '15:00:00', @chelsea_id, @arsenal_id, 1, 3, @stamford_bridge),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-02-20', '19:00:00', @mancity_id, @tottenham_id, 4, 2, @etihad),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-03-15', '18:00:00', @newcastle_id, @brighton_id, 2, 0, @st_james_park),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-03-25', '17:30:00', @leicester_id, @villa_id, 1, 1, @king_power),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-04-01', '20:00:00', @brighton_id, @mancity_id, 1, 2, @amex),
(UNHEX(REPLACE(UUID(), '-', '')), '2024-04-10', '15:00:00', @villa_id, @liverpool_id, 0, 2, @villa_park);

-- UPCOMING MATCHES (Scheduled - dates in 2026, 0-0 scores)
INSERT INTO matches (uuid, date, time, home_team_id, away_team_id, home_goals, away_goals, stadium_id) VALUES
-- Upcoming matches for Manchester United
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-01', '15:00:00', @manutd_id, @liverpool_id, 0, 0, @old_trafford),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-15', '17:30:00', @chelsea_id, @manutd_id, 0, 0, @stamford_bridge),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-01', '16:00:00', @manutd_id, @arsenal_id, 0, 0, @old_trafford),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-10', '20:00:00', @tottenham_id, @manutd_id, 0, 0, @tottenham),
-- Upcoming matches for Liverpool
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-05', '15:00:00', @liverpool_id, @chelsea_id, 0, 0, @anfield),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-20', '17:00:00', @liverpool_id, @tottenham_id, 0, 0, @anfield),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-05', '16:30:00', @arsenal_id, @liverpool_id, 0, 0, @emirates),
-- Upcoming matches for other teams
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-10', '15:00:00', @chelsea_id, @arsenal_id, 0, 0, @stamford_bridge),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-05-25', '19:00:00', @mancity_id, @newcastle_id, 0, 0, @etihad),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-15', '18:00:00', @brighton_id, @leicester_id, 0, 0, @amex),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-20', '17:30:00', @villa_id, @chelsea_id, 0, 0, @villa_park),
(UNHEX(REPLACE(UUID(), '-', '')), '2026-06-25', '20:00:00', @newcastle_id, @villa_id, 0, 0, @st_james_park);

-- Step 10: Add Player Statistics for PAST MATCHES ONLY (completed matches with scores)
-- First, ensure saves column exists
SET @dbname = DATABASE();
SET @tablename = 'match_player_stats';
SET @columnname = 'saves';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- For Goalkeepers: Add saves, passes, no goals/assists (only for past matches with scores)
INSERT INTO match_player_stats (match_uuid, player_id, goals, assists, passes, saves)
SELECT DISTINCT
    m.uuid,
    p.id,
    0 as goals,
    0 as assists,
    FLOOR(20 + RAND() * 15) as passes, -- 20-35 passes
    FLOOR(3 + RAND() * 5) as saves -- 3-8 saves per match
FROM matches m
INNER JOIN team ht ON ht.id = m.home_team_id
INNER JOIN team at ON at.id = m.away_team_id
INNER JOIN player p ON (p.team_id = ht.id OR p.team_id = at.id)
WHERE p.position = 'Goalkeeper'
  AND (m.home_goals > 0 OR m.away_goals > 0) -- Only matches with scores (past matches)
  AND NOT EXISTS (
    SELECT 1 FROM match_player_stats mps 
    WHERE mps.match_uuid = m.uuid AND mps.player_id = p.id
  );

-- For Forwards: Add goals, assists, passes, no saves
-- Increased probability to ensure players have good statistics
INSERT INTO match_player_stats (match_uuid, player_id, goals, assists, passes, saves)
SELECT DISTINCT
    m.uuid,
    p.id,
    CASE 
        WHEN RAND() > 0.5 THEN FLOOR(1 + RAND() * 3) -- 50% chance to score 1-3 goals per match
        ELSE 0
    END as goals,
    CASE 
        WHEN RAND() > 0.6 THEN 1 -- 40% chance to assist
        ELSE 0
    END as assists,
    FLOOR(25 + RAND() * 20) as passes, -- 25-45 passes
    0 as saves
FROM matches m
INNER JOIN team ht ON ht.id = m.home_team_id
INNER JOIN team at ON at.id = m.away_team_id
INNER JOIN player p ON (p.team_id = ht.id OR p.team_id = at.id)
WHERE p.position = 'Forward'
  AND (m.home_goals > 0 OR m.away_goals > 0) -- Only matches with scores (past matches)
  AND NOT EXISTS (
    SELECT 1 FROM match_player_stats mps 
    WHERE mps.match_uuid = m.uuid AND mps.player_id = p.id
  );

-- For Midfielders: Add goals (moderate), assists, passes, no saves
-- Midfielders score less but assist more
INSERT INTO match_player_stats (match_uuid, player_id, goals, assists, passes, saves)
SELECT DISTINCT
    m.uuid,
    p.id,
    CASE 
        WHEN RAND() > 0.7 THEN 1 -- 30% chance to score
        ELSE 0
    END as goals,
    CASE 
        WHEN RAND() > 0.4 THEN 1 -- 60% chance to assist (midfielders assist more)
        ELSE 0
    END as assists,
    FLOOR(40 + RAND() * 30) as passes, -- 40-70 passes (midfielders pass more)
    0 as saves
FROM matches m
INNER JOIN team ht ON ht.id = m.home_team_id
INNER JOIN team at ON at.id = m.away_team_id
INNER JOIN player p ON (p.team_id = ht.id OR p.team_id = at.id)
WHERE p.position = 'Midfielder'
  AND (m.home_goals > 0 OR m.away_goals > 0) -- Only matches with scores (past matches)
  AND NOT EXISTS (
    SELECT 1 FROM match_player_stats mps 
    WHERE mps.match_uuid = m.uuid AND mps.player_id = p.id
  );

-- For Defenders: Add goals (rare), assists, passes, no saves
-- Defenders score rarely but can assist
INSERT INTO match_player_stats (match_uuid, player_id, goals, assists, passes, saves)
SELECT DISTINCT
    m.uuid,
    p.id,
    CASE 
        WHEN RAND() > 0.9 THEN 1 -- 10% chance to score (rare but possible)
        ELSE 0
    END as goals,
    CASE 
        WHEN RAND() > 0.5 THEN 1 -- 50% chance to assist (defenders can assist from set pieces)
        ELSE 0
    END as assists,
    FLOOR(30 + RAND() * 25) as passes, -- 30-55 passes
    0 as saves
FROM matches m
INNER JOIN team ht ON ht.id = m.home_team_id
INNER JOIN team at ON at.id = m.away_team_id
INNER JOIN player p ON (p.team_id = ht.id OR p.team_id = at.id)
WHERE p.position = 'Defender'
  AND (m.home_goals > 0 OR m.away_goals > 0) -- Only matches with scores (past matches)
  AND NOT EXISTS (
    SELECT 1 FROM match_player_stats mps 
    WHERE mps.match_uuid = m.uuid AND mps.player_id = p.id
  );

-- Update existing records to have saves = 0 if they don't have it set
UPDATE match_player_stats 
SET saves = 0 
WHERE saves IS NULL;

-- Step 11: Verification queries
SELECT 
    'Premier League Setup Complete!' as summary,
    (SELECT COUNT(*) FROM city) as total_cities,
    (SELECT COUNT(*) FROM division WHERE name = 'Premier League') as premier_league_division,
    (SELECT COUNT(*) FROM stadium) as total_stadiums,
    (SELECT COUNT(*) FROM team) as total_teams,
    (SELECT COUNT(*) FROM player) as total_players,
    (SELECT COUNT(*) FROM matches) as total_matches,
    (SELECT COUNT(*) FROM match_player_stats) as total_player_statistics;

-- Show all teams with their cities and stadiums
SELECT 
    t.name as team_name,
    c.name as city,
    s.name as stadium,
    s.capacity
FROM team t
JOIN city c ON t.city_id = c.id
JOIN stadium s ON t.stadium_id = s.id
ORDER BY t.name;

-- Show players count per team
SELECT 
    t.name as team_name,
    COUNT(p.id) as player_count
FROM team t
LEFT JOIN player p ON t.id = p.team_id
GROUP BY t.id, t.name
ORDER BY t.name;

-- Show matches summary for 2026-04-01
SELECT 
    DATE_FORMAT(m.date, '%Y-%m-%d') as match_date,
    COUNT(*) as matches_count,
    GROUP_CONCAT(DISTINCT TIME_FORMAT(m.time, '%H:%i') ORDER BY m.time SEPARATOR ', ') as match_times
FROM matches m
GROUP BY m.date
ORDER BY m.date;

-- Show sample matches with teams
SELECT 
    DATE_FORMAT(m.date, '%Y-%m-%d') as match_date,
    TIME_FORMAT(m.time, '%H:%i') as match_time,
    ht.name as home_team,
    at.name as away_team,
    m.home_goals,
    m.away_goals,
    s.name as stadium
FROM matches m
JOIN team ht ON m.home_team_id = ht.id
JOIN team at ON m.away_team_id = at.id
JOIN stadium s ON m.stadium_id = s.id
ORDER BY m.date, m.time
LIMIT 10;

-- Show top scorers
SELECT 
    p.name as player_name,
    p.position,
    t.name as team_name,
    COUNT(mps.id) as matches_played,
    SUM(mps.goals) as total_goals,
    SUM(mps.assists) as total_assists,
    SUM(mps.passes) as total_passes
FROM match_player_stats mps
JOIN player p ON mps.player_id = p.id
JOIN team t ON p.team_id = t.id
WHERE p.position != 'Goalkeeper'
GROUP BY p.id, p.name, p.position, t.name
ORDER BY total_goals DESC, total_assists DESC
LIMIT 10;

-- Show goalkeepers with saves
SELECT 
    p.name as goalkeeper_name,
    t.name as team_name,
    COUNT(mps.id) as matches_played,
    SUM(mps.saves) as total_saves,
    ROUND(AVG(mps.saves), 2) as avg_saves_per_match,
    SUM(mps.passes) as total_passes
FROM match_player_stats mps
JOIN player p ON mps.player_id = p.id
JOIN team t ON p.team_id = t.id
WHERE p.position = 'Goalkeeper'
GROUP BY p.id, p.name, t.name
ORDER BY total_saves DESC
LIMIT 10;

