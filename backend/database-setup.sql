-- ============================================
-- Research Tracker Database Setup Script
-- ============================================
-- This script creates the database for the Research Project Tracker system
-- Run this before starting the Spring Boot application

-- Create database
CREATE DATABASE IF NOT EXISTS research_tracker;

-- Use the database
USE research_tracker;

-- Note: Tables will be automatically created by Spring Boot JPA
-- with spring.jpa.hibernate.ddl-auto=update

-- The following tables will be created:
-- 1. users (id, username, password, full_name, role, created_at)
-- 2. projects (id, title, summary, status, pi_id, tags, start_date, end_date, created_at, updated_at)
-- 3. milestones (id, project_id, title, description, due_date, is_completed, created_by)
-- 4. documents (id, project_id, title, description, url_or_path, uploaded_by, uploaded_at)

-- Grant privileges (adjust username/password as needed)
-- GRANT ALL PRIVILEGES ON research_tracker.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

SELECT 'Database setup completed successfully!' as Status;
