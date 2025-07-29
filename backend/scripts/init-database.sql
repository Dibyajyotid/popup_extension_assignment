-- Initialize PostgreSQL database for LinkedIn Scraper
-- Run this script if you need to set up the database manually

-- Create database (run as postgres user)
CREATE DATABASE linkedin_scraper;

-- Create user for the application
CREATE USER linkedin_user WITH PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE linkedin_scraper TO linkedin_user;

-- Connect to the new database
\c linkedin_scraper;

-- Create profiles table (optional - Sequelize will create this automatically)
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    about TEXT,
    bio TEXT,
    location VARCHAR(255),
    "followerCount" INTEGER DEFAULT 0,
    "connectionCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_url ON profiles(url);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles("createdAt");

-- Grant table permissions to user
GRANT ALL PRIVILEGES ON TABLE profiles TO linkedin_user;
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO linkedin_user;
