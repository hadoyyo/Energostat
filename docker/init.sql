CREATE DATABASE IF NOT EXISTS energostat_db;
USE energostat_db;

-- Table for storing country information
CREATE TABLE IF NOT EXISTS COUNTRY (
    countryId INT AUTO_INCREMENT PRIMARY KEY,
    countryName VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- Table for storing user information
CREATE TABLE IF NOT EXISTS APP_USER (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    country_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES COUNTRY(countryId)
) ENGINE = InnoDB;

-- Initial data for COUNTRY table TOP 100 most populous countries
INSERT IGNORE INTO COUNTRY (countryName) VALUES 
('China'), ('India'), ('United States'), ('Indonesia'), ('Pakistan'),
('Nigeria'), ('Brazil'), ('Bangladesh'), ('Russia'), ('Mexico'),
('Ethiopia'), ('Japan'), ('Philippines'), ('Egypt'), ('DR Congo'),
('Vietnam'), ('Iran'), ('Turkey'), ('Germany'), ('Thailand'),
('United Kingdom'), ('France'), ('Italy'), ('South Africa'), ('Tanzania'),
('Myanmar'), ('Kenya'), ('South Korea'), ('Colombia'), ('Spain'),
('Argentina'), ('Uganda'), ('Algeria'), ('Sudan'), ('Ukraine'),
('Iraq'), ('Afghanistan'), ('Poland'), ('Canada'), ('Morocco'),
('Saudi Arabia'), ('Uzbekistan'), ('Peru'), ('Angola'), ('Malaysia'),
('Mozambique'), ('Ghana'), ('Yemen'), ('Nepal'), ('Venezuela'),
('Madagascar'), ('Cameroon'), ('Côte d''Ivoire'), ('North Korea'), ('Australia'),
('Niger'), ('Taiwan'), ('Sri Lanka'), ('Burkina Faso'), ('Mali'),
('Romania'), ('Chile'), ('Kazakhstan'), ('Malawi'), ('Zambia'),
('Guatemala'), ('Ecuador'), ('Syria'), ('Netherlands'), ('Senegal'),
('Cambodia'), ('Chad'), ('Somalia'), ('Zimbabwe'), ('Guinea'),
('Rwanda'), ('Benin'), ('Burundi'), ('Tunisia'), ('Belgium'),
('Bolivia'), ('Haiti'), ('Dominican Republic'), ('Jordan'), ('South Sudan'),
('Sweden'), ('Azerbaijan'), ('Hungary'), ('Belarus'), ('Honduras'),
('Tajikistan'), ('Austria'), ('Switzerland'), ('Israel'), ('Papua New Guinea'),
('Serbia'), ('Paraguay'), ('Laos'), ('Libya'), ('Lebanon');