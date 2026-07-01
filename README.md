# 🌐 BlogSphere: Full-Stack Blog Platform with Comments

Welcome to **BlogSphere**, a modern, secure, and responsive full-stack blog platform built with **React, Spring Boot, Spring Security (JWT), and MySQL**.

This repository contains the complete production-ready source code for both the frontend client and the backend server, designed according to clean architecture, SOLID principles, and clean-layered packaging.

---

## 📂 Project Directory Structure

```text
BlogSphere/
├── backend/                             # Spring Boot Java Backend
│   ├── pom.xml                          # Maven build file (Dependencies & Plugins)
│   ├── schema.sql                       # MySQL schema creation & seeds script
│   └── src/
│       └── main/
│           ├── java/com/blogsphere/
│           │   ├── BlogSphereApplication.java  # Spring Boot entry point
│           │   ├── config/              # Security and Web configurations
│           │   │   ├── CorsConfig.java
│           │   │   └── SecurityConfig.java
│           │   ├── controller/          # REST Controllers (API Layer)
│           │   │   ├── AuthController.java
│           │   │   ├── PostController.java
│           │   │   ├── CommentController.java
│           │   │   ├── UserController.java
│           │   │   └── CategoryController.java
│           │   ├── dto/                 # Data Transfer Objects (Validation rules)
│           │   │   ├── UserDTO.java
│           │   │   ├── UserRegistrationDTO.java
│           │   │   ├── UserLoginDTO.java
│           │   │   ├── AuthResponseDTO.java
│           │   │   ├── PostDTO.java
│           │   │   ├── CommentDTO.java
│           │   │   └── AdminStatsDTO.java
│           │   ├── entity/              # JPA Relational Entities
│           │   │   ├── User.java
│           │   │   ├── Post.java
│           │   │   ├── Comment.java
│           │   │   └── Like.java
│           │   ├── exception/           # Global Exception Advising & Classes
│           │   │   ├── BlogAPIException.java
│           │   │   ├── ResourceNotFoundException.java
│           │   │   ├── ErrorDetails.java
│           │   │   └── GlobalExceptionHandler.java
│           │   ├── mapper/              # Entity-DTO mapping components
│           │   │   ├── UserMapper.java
│           │   │   ├── PostMapper.java
│           │   │   └── CommentMapper.java
│           │   ├── repository/          # Spring Data JPA Interfaces
│           │   │   ├── UserRepository.java
│           │   │   ├── PostRepository.java
│           │   │   ├── CommentRepository.java
│           │   │   └── LikeRepository.java
│           │   ├── security/            # JWT validation and user detail configurations
│           │   │   ├── JwtAuthenticationEntryPoint.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   ├── JwtTokenProvider.java
│           │   │   └── CustomUserDetailsService.java
│           │   └── service/             # Business Service Abstraction & Implementations
│           │       ├── AuthService.java
│           │       ├── PostService.java
│           │       ├── CommentService.java
│           │       ├── UserService.java
│           │       ├── AdminService.java
│           │       └── impl/
│           │           ├── AuthServiceImpl.java
│           │           ├── PostServiceImpl.java
│           │           ├── CommentServiceImpl.java
│           │           ├── UserServiceImpl.java
│           │           └── AdminServiceImpl.java
│           └── resources/
│               └── application.properties # Server, Database & Token configs
│
└── src/                                 # Vite + React Frontend Client
    ├── App.tsx                          # Router and State coordinator
    ├── index.css                        # Global styles & Tailwind
    ├── main.tsx                         # Client DOM entrypoint
    ├── types.ts                         # Shared TypeScript Interfaces
    ├── components/                      # Reusable UI widgets
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── BlogCard.tsx
    │   ├── CommentSection.tsx
    │   ├── AdminStatsPanel.tsx
    │   └── Toast.tsx
    ├── utils/
    │   └── api.ts                       # REST API client & Axios proxy
    └── views/                           # Individual Screen Layouts
        ├── HomeView.tsx                 # Landing / Featured Section
        ├── BlogListView.tsx             # Paginated Feed / Category filters
        ├── BlogDetailsView.tsx          # Single Post reading & thread replies
        ├── CreatePostView.tsx           # Writer interface
        ├── EditPostView.tsx             # Content editing screen
        ├── ProfileView.tsx              # User Settings
        ├── LoginView.tsx                # JWT authenticator page
        ├── RegisterView.tsx             # User Signup form
        ├── DashboardView.tsx            # Member content dashboard
        └── AdminDashboardView.tsx       # System admin console
```

---

## 📊 Database Entity Relationship Diagram (ERD)

Below is the database logical entity schema, showing primary keys (`PK`), foreign keys (`FK`), and cardinalities:

```text
  ┌────────────────────────┐
  │         USERS          │
  ├────────────────────────┤
  │ PK  id                 │◄───┐
  │     name               │    │
  │     username (unique)  │    │ (1 to many)
  │     email (unique)     │    │
  │     password           │    │
  │     role               │    │
  │     profile_image      │    │
  │     created_at         │    │
  └────────────────────────┘    │
            │                   │
            │ (1 to many)       │
            ▼                   │
  ┌────────────────────────┐    │
  │         POSTS          │    │
  ├────────────────────────┤    │
  │ PK  id                 │◄───┼──────┐
  │     title              │    │      │
  │     content            │    │      │
  │     excerpt            │    │      │ (1 to many)
  │     category           │    │      │
  │     image_url          │    │      │
  │     created_at         │    │      │
  │     updated_at         │    │      │
  │ FK  author_id          │────┘      │
  └────────────────────────┘           │
            │                          │
            │ (1 to many)              │
            ▼                          │
  ┌────────────────────────┐           │
  │        COMMENTS        │           │
  ├────────────────────────┤           │
  │ PK  id                 │           │
  │     text               │           │
  │     created_at         │           │
  │     updated_at         │           │
  │ FK  user_id            │───────────┼───┐
  │ FK  post_id            │───────────┘   │
  │ FK  parent_id (self)   │               │
  └────────────────────────┘               │
                                           │
                                           │
  ┌────────────────────────┐               │
  │         LIKES          │               │
  ├────────────────────────┤               │
  │ PK  id                 │               │
  │ FK  user_id            │───────────────┘
  │ FK  post_id            │
  └────────────────────────┘
```

---

## ⚡ API Endpoints Documentation

All requests use standard JSON payloads. Operations modifying database content require the `Authorization: Bearer <your_jwt_token>` request header.

### 🔑 Authentication APIs

| Method | Endpoint | Description | Request Body | Response Success (200/210) |
|---|---|---|---|---|
| **POST** | `/api/auth/register` | Sign up a new user | `{ name, username, email, password }` | `"User registered successfully!"` |
| **POST** | `/api/auth/login` | Sign in / Authenticate | `{ email, password }` | `{ token, id, name, username, email, role, profileImage }` |

### 📝 Blog Post APIs

| Method | Endpoint | Description | URL Query Params | Auth Required |
|---|---|---|---|---|
| **GET** | `/api/posts` | Fetch paginated posts feed | `category`, `search`, `authorId`, `page`, `size`, `sortBy` | No |
| **GET** | `/api/posts/{id}` | Read a single post | None | No |
| **POST** | `/api/posts` | Create new article | None | Yes |
| **PUT** | `/api/posts/{id}` | Update existing article | None | Yes (Author or ADMIN) |
| **DELETE** | `/api/posts/{id}` | Delete article | None | Yes (Author or ADMIN) |
| **GET** | `/api/posts/search` | Search articles flat | `q=yourQuery` | No |
| **POST** | `/api/posts/{id}/like` | Like an article | None | Yes |
| **DELETE** | `/api/posts/{id}/unlike` | Unlike an article | None | Yes |

### 💬 Comment APIs

| Method | Endpoint | Description | Request Body | Auth Required |
|---|---|---|---|---|
| **GET** | `/api/comments/post/{postId}`| Load article comments list | None | No |
| **POST** | `/api/comments` | Add new comment (or reply) | `{ text, postId, parentCommentId }` | Yes |
| **PUT** | `/api/comments/{id}` | Edit comment text | `{ text }` | Yes (Owner) |
| **DELETE** | `/api/comments/{id}` | Delete comment | None | Yes (Owner or ADMIN) |

---

## 🚀 Step-by-Step Setup Instructions

Follow these steps to launch the MySQL database, configure and start the Spring Boot server, and run the React web frontend.

### 1️⃣ Database Setup (MySQL)
1. Launch your local MySQL server.
2. Log into the MySQL terminal command-line or client software (e.g., MySQL Workbench, DBeaver):
   ```bash
   mysql -u root -p
   ```
3. Run the complete DB schema and seed initializer from the `/backend/schema.sql` script:
   ```sql
   SOURCE backend/schema.sql;
   ```
   This will automatically:
   - Create the `blogsphere` database.
   - Establish `users`, `posts`, `comments`, and `likes` tables with appropriate foreign keys and indexes.
   - Seed default administrative (`admin@blogsphere.com`) and regular author accounts (`jane@blogsphere.com`, `john@blogsphere.com`).

---

### 2️⃣ Backend Configuration & Startup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Open `src/main/resources/application.properties` and customize the connection credentials if necessary:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```
3. Compile and build the Maven artifact package:
   ```bash
   mvn clean package
   ```
4. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will launch and bind to standard port `8080`.

---

### 3️⃣ Frontend Client Installation & Startup (React + Vite)
1. Return to the workspace root directory:
   ```bash
   cd ..
   ```
2. Install all frontend npm dependencies:
   ```bash
   npm install
   ```
3. Launch the local React development server:
   ```bash
   npm run dev
   ```
   Vite will serve the frontend client on your standard local environment port. Open the designated URL (usually `http://localhost:3000` or `http://localhost:5173`) in your web browser.

---

### 💡 Core Default Logins for Testing

| Email | Password | Role | Features Available |
|---|---|---|---|
| **admin@blogsphere.com** | `adminpassword` | **ADMIN** | Full Post CRUD, Comment Moderation, Role assignment, Stats metrics dashboard |
| **jane@blogsphere.com** | `password123` | **USER** | Create Post, Edit own post, Write nested comments, Like posts |
| **john@blogsphere.com** | `password123` | **USER** | Create Post, Edit own post, Write nested comments, Like posts |
