-- BlogSphere MySQL Database Schema & Initial Seeds

CREATE DATABASE IF NOT EXISTS blogsphere;
USE blogsphere;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    profile_image VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    author_id BIGINT NOT NULL,
    CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    parent_id BIGINT,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Likes Table
CREATE TABLE IF NOT EXISTS likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    CONSTRAINT uq_user_post_like UNIQUE (user_id, post_id),
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Seed Data
-- Passwords are BCrypt-encoded with salt rounds of 10
-- 'adminpassword' -> $2a$10$tZk5/f8FpD1O983YfPjSFe7D86h9qK.QW/y7UeZfshlTfH5SUpNGu
-- 'password123'   -> $2a$10$wO36iZ/mQ8N8Z6VwBbyFSuU/S33fK3pCgX3893vS1N/q5v1.2HHeK

INSERT IGNORE INTO users (id, name, username, email, password, role, profile_image, created_at)
VALUES 
(1, 'Admin User', 'admin', 'admin@blogsphere.com', '$2a$10$tZk5/f8FpD1O983YfPjSFe7D86h9qK.QW/y7UeZfshlTfH5SUpNGu', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', '2026-01-01 10:00:00'),
(2, 'Jane Doe', 'janedoe', 'jane@blogsphere.com', '$2a$10$wO36iZ/mQ8N8Z6VwBbyFSuU/S33fK3pCgX3893vS1N/q5v1.2HHeK', 'USER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', '2026-02-15 14:30:00'),
(3, 'John Smith', 'johnsmith', 'john@blogsphere.com', '$2a$10$wO36iZ/mQ8N8Z6VwBbyFSuU/S33fK3pCgX3893vS1N/q5v1.2HHeK', 'USER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', '2026-03-10 09:15:00');

INSERT IGNORE INTO posts (id, title, content, excerpt, category, image_url, created_at, updated_at, author_id)
VALUES
(1, 'The Future of Full-Stack Web Development', 'Discover how modern tools, edge runtimes, and layered architectures are reshaping the way we build full-stack web applications.\n\nEdge runtimes allow us to run server-side code physically closer to our users, reducing latency to virtually zero.', 'Discover how modern tools, edge runtimes, and layered architectures are reshaping the way we build full-stack web applications.', 'Technology', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200', '2026-06-20 10:30:00', '2026-06-20 10:30:00', 2),
(2, 'Mastering Clean Code in Spring Boot', 'Spring Boot has become the de facto standard for enterprise Java development. However, with great power comes the responsibility of keeping the codebase clean and modular.\n\nAlways ensure controllers only handle web requests, service layers contain pure business logic, and repositories are purely for data access.', 'A deep dive into writing maintainable, scalable, and testable Spring Boot applications using clean architecture and SOLID principles.', 'Programming', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200', '2026-06-22 14:15:00', '2026-06-22 14:15:00', 1);

INSERT IGNORE INTO comments (id, text, created_at, updated_at, user_id, post_id, parent_id)
VALUES
(1, 'This is a brilliant overview! The transition to edge runtimes has definitely saved our team a lot of infrastructure cost.', '2026-06-20 11:45:00', '2026-06-20 11:45:00', 3, 1, NULL),
(2, 'Absolutely agree, John! We saw our initial load times drop by 40% after moving our dynamic components to edge handlers.', '2026-06-20 12:10:00', '2026-06-20 12:10:00', 2, 1, 1);

INSERT IGNORE INTO likes (id, user_id, post_id)
VALUES
(1, 3, 1),
(2, 2, 2);
