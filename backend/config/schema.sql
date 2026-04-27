-- Admin Dashboard Database Schema
-- Run this file to initialize the database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);

-- Seed admin user (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO users (name, email, password, role, created_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  '2026-01-15 00:00:00'
) ON CONFLICT (email) DO NOTHING;

-- Seed regular user (password: user123)
INSERT INTO users (name, email, password, role, created_at)
VALUES (
  'John Doe',
  'john@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'user',
  '2026-01-15 00:00:00'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password, role, created_at)
VALUES (
  'Jane Smith',
  'jane@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'user',
  '2026-01-15 00:00:00'
) ON CONFLICT (email) DO NOTHING;

-- Seed contact submissions
INSERT INTO contact_submissions (full_name, email, message, created_at)
VALUES (
  'Mike Williams',
  'mike@example.com',
  'I encountered an issue with my account. Please help me resolve this.',
  '2026-04-22 16:50:00'
) ON CONFLICT DO NOTHING;

INSERT INTO contact_submissions (full_name, email, message, created_at)
VALUES (
  'Sarah Johnson',
  'sarah@example.com',
  'Hi, I would like to know more about your services. Can you provide more information?',
  '2026-04-20 21:00:00'
) ON CONFLICT DO NOTHING;
