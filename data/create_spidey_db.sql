USE spideyDb;
GO

-- Create Users table
CREATE TABLE Users (
    userId INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(100) UNIQUE
);

-- Create Sightings table
CREATE TABLE Sightings (
    sightingId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(userId),
    location NVARCHAR(255),
    image VARBINARY(MAX),
    description NVARCHAR(2000),
    timestamp DATE
);