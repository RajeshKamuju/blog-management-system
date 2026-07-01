import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

// Setup secret and directory
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "blogsphere-secure-token-secret-key-987654321";

// Interfaces to mirror Database design
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  profileImage: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postId: string;
  parentCommentId: string | null;
}

interface Like {
  id: string;
  userId: string;
  postId: string;
}

interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
}

// Initial seed data if no db.json exists
const initialDB: Database = {
  users: [
    {
      id: "u-admin",
      name: "Admin User",
      username: "admin",
      email: "admin@blogsphere.com",
      passwordHash: crypto.createHash("sha256").update("adminpassword").digest("hex"),
      role: "ADMIN",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      createdAt: new Date("2026-01-01").toISOString(),
    },
    {
      id: "u-jane",
      name: "Jane Doe",
      username: "janedoe",
      email: "jane@blogsphere.com",
      passwordHash: crypto.createHash("sha256").update("password123").digest("hex"),
      role: "USER",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      createdAt: new Date("2026-02-15").toISOString(),
    },
    {
      id: "u-john",
      name: "John Smith",
      username: "johnsmith",
      email: "john@blogsphere.com",
      passwordHash: crypto.createHash("sha256").update("password123").digest("hex"),
      role: "USER",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      createdAt: new Date("2026-03-10").toISOString(),
    },
  ],
  posts: [
    {
      id: "p-1",
      title: "The Future of Full-Stack Web Development",
      category: "Technology",
      excerpt: "Discover how modern tools, edge runtimes, and layered architectures are reshaping the way we build full-stack web applications.",
      content: `The landscape of full-stack web development is changing faster than ever. From serverless databases and edge computing to next-generation bundlers and frameworks, the boundary between frontend and backend has blurred.

### The Shift to the Edge
Edge runtimes allow us to run server-side code physically closer to our users, reducing latency to virtually zero. This is a game-changer for dynamic applications that require high performance.

### Type-Safe Full-Stack Connections
Tools like TypeScript, and custom API layers allow developers to share types seamlessly between frontend and backend. This eliminates entire classes of bugs and speeds up development cycles significantly.

### Conclusion
To stay competitive, developers must master both client-side interactivity and server-side optimization. The future belongs to those who can build seamless, cohesive digital experiences.`,
      featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
      tags: ["webdev", "typescript", "architecture", "fullstack"],
      createdAt: new Date("2026-06-20T10:30:00Z").toISOString(),
      updatedAt: new Date("2026-06-20T10:30:00Z").toISOString(),
      authorId: "u-jane",
    },
    {
      id: "p-2",
      title: "Mastering Clean Code in Spring Boot",
      category: "Programming",
      excerpt: "A deep dive into writing maintainable, scalable, and testable Spring Boot applications using clean architecture and SOLID principles.",
      content: `Spring Boot has become the de facto standard for enterprise Java development. However, with great power comes the responsibility of keeping the codebase clean and modular.

### Layered Architecture vs. Clean Architecture
A standard layered architecture (Controller -> Service -> Repository) is a great starting point, but without strict rules, logic can leak across boundaries. Always ensure controllers only handle web requests, service layers contain pure business logic, and repositories are purely for data access.

### DTOs and Mapping
Never expose your database entities directly to the API consumer. Implement the Data Transfer Object (DTO) pattern and use mappers to translate between entities and DTOs. This decouples your database schema from your API contract, allowing you to iterate on either independently.

### Exception Handling
Implement a @ControllerAdvice to intercept exceptions globally and return standardized error payloads. This ensures your clients always receive a consistent structure, even during unexpected failures.`,
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
      tags: ["springboot", "java", "cleancode", "backend"],
      createdAt: new Date("2026-06-22T14:15:00Z").toISOString(),
      updatedAt: new Date("2026-06-22T14:15:00Z").toISOString(),
      authorId: "u-admin",
    },
    {
      id: "p-3",
      title: "The Art of Minimalist UI Design",
      category: "Design",
      excerpt: "How to design interfaces that are clean, highly legible, and beautifully functional by embracing negative space and typography.",
      content: `Good design is as little design as possible. In a world full of visual noise, minimalist interfaces stand out by offering clarity, focus, and a premium aesthetic.

### Visual Rhythm & Negative Space
Negative space is not empty space; it is an active design element. Generous margins and paddings guide the user's eye and establish a clear visual hierarchy. When everything screams for attention, nothing is heard.

### Typography Pairing
Pairing a clean sans-serif like Inter for body text with an expressive sans-serif like Space Grotesk for headings creates a high-contrast, modern feeling. Keep font weights consistent and use hierarchy instead of random size variations.

### Color Strategy
Limit your palette to 2 or 3 colors. Use neutral grays for structural elements, a deep charcoal for readable text, and a single accent color for calls to action.`,
      featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200",
      tags: ["uiux", "minimalism", "design", "tailwind"],
      createdAt: new Date("2026-06-25T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-25T09:00:00Z").toISOString(),
      authorId: "u-john",
    },
    {
      id: "p-4",
      title: "Wanderlust: Finding Peace in the Swiss Alps",
      category: "Travel",
      excerpt: "A journey through the snow-capped peaks and serene valleys of Switzerland, discovering nature's ultimate sanctuary.",
      content: `There is a unique stillness in the Swiss Alps that is hard to find anywhere else in the world. As you ascend into the high valleys, the sounds of urban life fade, replaced by the whispering wind and the distant chime of cowbells.

### Hiking the Lauterbrunnen Valley
Lauterbrunnen, nestled in a deep valley surrounded by 72 roaring waterfalls, feels like stepping straight into a fairytale. The hiking trails range from gentle meadow walks to intense high-altitude tracks, each offering stunning views of the Eiger, Mönch, and Jungfrau peaks.

### Connecting with Nature
Slowing down to match the pace of the mountains is deeply therapeutic. Spending a night in a high-altitude alpine hut, waking up to the first light of dawn hitting the glaciers, is an experience that stays with you forever.`,
      featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      tags: ["travel", "nature", "switzerland", "peace"],
      createdAt: new Date("2026-06-27T16:45:00Z").toISOString(),
      updatedAt: new Date("2026-06-27T16:45:00Z").toISOString(),
      authorId: "u-jane",
    }
  ],
  comments: [
    {
      id: "c-1",
      text: "This is a brilliant overview! The transition to edge runtimes has definitely saved our team a lot of infrastructure cost.",
      createdAt: new Date("2026-06-20T11:45:00Z").toISOString(),
      updatedAt: new Date("2026-06-20T11:45:00Z").toISOString(),
      userId: "u-john",
      postId: "p-1",
      parentCommentId: null,
    },
    {
      id: "c-2",
      text: "Absolutely agree, John! We saw our initial load times drop by 40% after moving our dynamic components to edge handlers.",
      createdAt: new Date("2026-06-20T12:10:00Z").toISOString(),
      updatedAt: new Date("2026-06-20T12:10:00Z").toISOString(),
      userId: "u-jane",
      postId: "p-1",
      parentCommentId: "c-1",
    },
    {
      id: "c-3",
      text: "Minimalist design is so hard to get right, but when it is, it feels effortless. Great read!",
      createdAt: new Date("2026-06-25T14:30:00Z").toISOString(),
      updatedAt: new Date("2026-06-25T14:30:00Z").toISOString(),
      userId: "u-jane",
      postId: "p-3",
      parentCommentId: null,
    }
  ],
  likes: [
    { id: "l-1", userId: "u-john", postId: "p-1" },
    { id: "l-2", userId: "u-jane", postId: "p-2" },
    { id: "l-3", userId: "u-admin", postId: "p-3" },
    { id: "l-4", userId: "u-john", postId: "p-3" }
  ]
};

// Database state accessor with auto-save & backup
let db: Database = { ...initialDB };

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(content);
    } else {
      saveDB();
    }
  } catch (err) {
    console.error("Error loading database:", err);
    db = { ...initialDB };
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

// Load database immediately
loadDB();

// Helper JWT function using standard crypto
function base64url(str: Buffer | string): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signToken(payload: object): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest();
  const encodedSignature = base64url(signature);
  return `${signatureInput}.${encodedSignature}`;
}

function verifyToken(token: string): any {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !encodedSignature) return null;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = base64url(
      crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest()
    );
    if (encodedSignature !== expectedSignature) return null;
    const payloadStr = Buffer.from(encodedPayload, "base64").toString("utf8");
    return JSON.parse(payloadStr);
  } catch (e) {
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Cors / API Headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Authenticate middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Attach user information to request
    req.user = db.users.find(u => u.id === payload.userId);
    if (!req.user) {
      return res.status(404).json({ error: "Authenticated user not found" });
    }
    next();
  };

  // --- REST API ENDPOINTS ---

  // Health API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "BlogSphere API" });
  });

  // Authentication APIs
  app.post("/api/auth/register", (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "Name, username, email, and password are required" });
    }

    const emailExists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const usernameExists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (emailExists) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    if (usernameExists) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const newUser: User = {
      id: "u-" + Math.random().toString(36).substring(2, 9),
      name,
      username,
      email,
      passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
      role: "USER", // Default role
      profileImage: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB();

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.json({
      token,
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    });
  });

  // User Profile APIs
  app.get("/api/users/profile", authenticateToken, (req: any, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    });
  });

  app.put("/api/users/profile", authenticateToken, (req: any, res) => {
    const user = req.user;
    const { name, username, profileImage, password } = req.body;

    if (username && username.toLowerCase() !== user.username.toLowerCase()) {
      const usernameExists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== user.id);
      if (usernameExists) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (password) {
      user.passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    }

    saveDB();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  });

  // Admin Manage Users (GET /api/admin/users)
  app.get("/api/admin/users", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const safeUsers = db.users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      profileImage: u.profileImage,
      createdAt: u.createdAt
    }));
    res.json(safeUsers);
  });

  // Admin Update User Role
  app.put("/api/admin/users/:id/role", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const targetUser = db.users.find(u => u.id === req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { role } = req.body;
    if (role !== "USER" && role !== "ADMIN") {
      return res.status(400).json({ error: "Invalid role. Must be USER or ADMIN." });
    }

    targetUser.role = role;
    saveDB();
    res.json({ message: "User role updated successfully", user: targetUser });
  });

  // Admin Delete User
  app.delete("/api/admin/users/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Restrict self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "You cannot delete your own admin account" });
    }

    db.users.splice(userIndex, 1);
    // Cascade delete posts, comments, likes from this user
    db.posts = db.posts.filter(p => p.authorId !== req.params.id);
    db.comments = db.comments.filter(c => c.userId !== req.params.id);
    db.likes = db.likes.filter(l => l.userId !== req.params.id);

    saveDB();
    res.json({ message: "User and their related data deleted successfully" });
  });

  // Post APIs
  // GET /api/posts - view all blog posts (with pagination, filter, search)
  app.get("/api/posts", (req, res) => {
    let result = [...db.posts];

    // Filter by category
    const { category, tag, authorId, search, sortBy, sortDir, page, size } = req.query;

    if (category) {
      result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    // Filter by tag
    if (tag) {
      result = result.filter(p => p.tags.some(t => t.toLowerCase() === String(tag).toLowerCase()));
    }

    // Filter by author
    if (authorId) {
      result = result.filter(p => p.authorId === String(authorId));
    }

    // Search query
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
      );
    }

    // Hydrate with details (likesCount, author object)
    const hydratedResult = result.map(p => {
      const author = db.users.find(u => u.id === p.authorId);
      const likesCount = db.likes.filter(l => l.postId === p.id).length;
      return {
        ...p,
        likesCount,
        author: author ? { id: author.id, name: author.name, username: author.username, profileImage: author.profileImage } : null
      };
    });

    // Sorting
    const sortField = String(sortBy || "createdAt");
    const sortDirection = String(sortDir || "desc").toLowerCase();

    hydratedResult.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const pageNum = parseInt(String(page || "0"), 10);
    const pageSize = parseInt(String(size || "10"), 10);
    const start = pageNum * pageSize;
    const paginated = hydratedResult.slice(start, start + pageSize);

    res.json({
      content: paginated,
      pageable: { pageNumber: pageNum, pageSize: pageSize },
      totalElements: hydratedResult.length,
      totalPages: Math.ceil(hydratedResult.length / pageSize),
      last: start + pageSize >= hydratedResult.length
    });
  });

  // GET /api/posts/search - Search posts query
  app.get("/api/posts/search", (req, res) => {
    const query = String(req.query.q || "").toLowerCase();
    const result = db.posts.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query)
    );

    const hydrated = result.map(p => {
      const author = db.users.find(u => u.id === p.authorId);
      const likesCount = db.likes.filter(l => l.postId === p.id).length;
      return {
        ...p,
        likesCount,
        author: author ? { id: author.id, name: author.name, username: author.username, profileImage: author.profileImage } : null
      };
    });

    res.json(hydrated);
  });

  // GET /api/posts/category/:category - Filter by Category
  app.get("/api/posts/category/:category", (req, res) => {
    const category = req.params.category;
    const result = db.posts.filter(p => p.category.toLowerCase() === category.toLowerCase());

    const hydrated = result.map(p => {
      const author = db.users.find(u => u.id === p.authorId);
      const likesCount = db.likes.filter(l => l.postId === p.id).length;
      return {
        ...p,
        likesCount,
        author: author ? { id: author.id, name: author.name, username: author.username, profileImage: author.profileImage } : null
      };
    });

    res.json(hydrated);
  });

  // GET /api/posts/:id - Post detail
  app.get("/api/posts/:id", (req, res) => {
    const post = db.posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const author = db.users.find(u => u.id === post.authorId);
    const likesCount = db.likes.filter(l => l.postId === post.id).length;

    res.json({
      ...post,
      likesCount,
      author: author ? { id: author.id, name: author.name, username: author.username, profileImage: author.profileImage, email: author.email } : null
    });
  });

  // POST /api/posts - Create post
  app.post("/api/posts", authenticateToken, (req: any, res) => {
    const { title, content, excerpt, featuredImage, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, content, and category are required fields" });
    }

    const newPost: Post = {
      id: "p-" + Math.random().toString(36).substring(2, 9),
      title,
      content,
      excerpt: excerpt || (content.substring(0, 150) + "..."),
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
      category,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: req.user.id
    };

    db.posts.push(newPost);
    saveDB();

    res.status(201).json(newPost);
  });

  // PUT /api/posts/:id - Edit post
  app.put("/api/posts/:id", authenticateToken, (req: any, res) => {
    const post = db.posts.find(p => p.id === req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Role-based verification
    if (post.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You are not authorized to edit this post" });
    }

    const { title, content, excerpt, featuredImage, category, tags } = req.body;

    if (title) post.title = title;
    if (content) {
      post.content = content;
      if (!excerpt) {
        post.excerpt = content.substring(0, 150) + "...";
      }
    }
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (featuredImage) post.featuredImage = featuredImage;
    if (category) post.category = category;
    if (tags) post.tags = Array.isArray(tags) ? tags : [];
    post.updatedAt = new Date().toISOString();

    saveDB();

    res.json(post);
  });

  // DELETE /api/posts/:id - Delete post
  app.delete("/api/posts/:id", authenticateToken, (req: any, res) => {
    const postIndex = db.posts.findIndex(p => p.id === req.params.id);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = db.posts[postIndex];

    // Role-based verification
    if (post.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    db.posts.splice(postIndex, 1);
    // Cascade delete comments and likes for this post
    db.comments = db.comments.filter(c => c.postId !== req.params.id);
    db.likes = db.likes.filter(l => l.postId !== req.params.id);

    saveDB();

    res.json({ message: "Post and its comments/likes deleted successfully" });
  });

  // Comment APIs
  // GET /api/comments/post/:postId - Get comments for a post
  app.get("/api/comments/post/:postId", (req, res) => {
    const { postId } = req.params;
    const comments = db.comments.filter(c => c.postId === postId);

    // Map comments with author profile information
    const hydratedComments = comments.map(c => {
      const user = db.users.find(u => u.id === c.userId);
      return {
        ...c,
        user: user ? { id: user.id, name: user.name, username: user.username, profileImage: user.profileImage } : null
      };
    });

    // To properly support nested comments: we can return a tree or a flat list and let client build the tree.
    // Flat list is easier to manipulate, but we will make sure each comment has its `parentCommentId` so we support infinite nesting.
    res.json(hydratedComments);
  });

  // POST /api/comments - Create comment (and replies)
  app.post("/api/comments", authenticateToken, (req: any, res) => {
    const { text, postId, parentCommentId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ error: "Comment text and postId are required" });
    }

    const postExists = db.posts.some(p => p.id === postId);
    if (!postExists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (parentCommentId) {
      const parentExists = db.comments.some(c => c.id === parentCommentId);
      if (!parentExists) {
        return res.status(400).json({ error: "Parent comment not found" });
      }
    }

    const newComment: Comment = {
      id: "c-" + Math.random().toString(36).substring(2, 9),
      text,
      postId,
      parentCommentId: parentCommentId || null,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.comments.push(newComment);
    saveDB();

    res.status(201).json({
      ...newComment,
      user: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        profileImage: req.user.profileImage
      }
    });
  });

  // PUT /api/comments/:id - Edit comment
  app.put("/api/comments/:id", authenticateToken, (req: any, res) => {
    const comment = db.comments.find(c => c.id === req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to edit this comment" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    comment.text = text;
    comment.updatedAt = new Date().toISOString();
    saveDB();

    res.json({
      ...comment,
      user: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        profileImage: req.user.profileImage
      }
    });
  });

  // DELETE /api/comments/:id - Delete comment
  app.delete("/api/comments/:id", authenticateToken, (req: any, res) => {
    const commentIndex = db.comments.findIndex(c => c.id === req.params.id);

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = db.comments[commentIndex];

    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    // To delete a comment, we can cascade and delete all its child replies recursively or set their parents to null/anonymous, 
    // or delete child replies. Deleting child replies is the standard and cleanest.
    const commentsToDelete = [req.params.id];
    
    // Find nested children recursively
    const findChildren = (parentId: string) => {
      db.comments.forEach(c => {
        if (c.parentCommentId === parentId) {
          commentsToDelete.push(c.id);
          findChildren(c.id);
        }
      });
    };
    findChildren(req.params.id);

    db.comments = db.comments.filter(c => !commentsToDelete.includes(c.id));
    saveDB();

    res.json({ message: "Comment and its replies deleted successfully" });
  });

  // Like APIs
  // POST /api/posts/:id/like - Like a post
  app.post("/api/posts/:id/like", authenticateToken, (req: any, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const postExists = db.posts.some(p => p.id === postId);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = db.likes.some(l => l.postId === postId && l.userId === userId);
    if (alreadyLiked) {
      return res.status(400).json({ error: "Post already liked" });
    }

    const newLike: Like = {
      id: "l-" + Math.random().toString(36).substring(2, 9),
      userId,
      postId
    };

    db.likes.push(newLike);
    saveDB();

    const likesCount = db.likes.filter(l => l.postId === postId).length;
    res.json({ message: "Post liked successfully", likesCount });
  });

  // DELETE /api/posts/:id/unlike - Unlike a post
  app.delete("/api/posts/:id/unlike", authenticateToken, (req: any, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const likeIndex = db.likes.findIndex(l => l.postId === postId && l.userId === userId);
    if (likeIndex === -1) {
      return res.status(400).json({ error: "Post has not been liked by this user" });
    }

    db.likes.splice(likeIndex, 1);
    saveDB();

    const likesCount = db.likes.filter(l => l.postId === postId).length;
    res.json({ message: "Post unliked successfully", likesCount });
  });

  // Like Status API for Authenticated User (checks if current logged-in user liked the post)
  app.get("/api/posts/:id/like-status", authenticateToken, (req: any, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const liked = db.likes.some(l => l.postId === postId && l.userId === userId);
    res.json({ liked });
  });

  // GET /api/categories - Get list of categories and counts
  app.get("/api/categories", (req, res) => {
    const counts: { [key: string]: number } = {};
    db.posts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const result = Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    }));
    res.json(result);
  });

  // GET /api/tags - Get popular tags
  app.get("/api/tags", (req, res) => {
    const counts: { [key: string]: number } = {};
    db.posts.forEach(p => {
      p.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    const result = Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    }));
    res.json(result);
  });

  // GET /api/stats - Admin Dashboard stats
  app.get("/api/admin/stats", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const postsCount = db.posts.length;
    const usersCount = db.users.length;
    const commentsCount = db.comments.length;
    const likesCount = db.likes.length;

    // Likes per post category
    const categoryLikes: { [key: string]: number } = {};
    db.posts.forEach(p => {
      const pLikes = db.likes.filter(l => l.postId === p.id).length;
      categoryLikes[p.category] = (categoryLikes[p.category] || 0) + pLikes;
    });

    const popularCategories = Object.keys(categoryLikes).map(name => ({
      name,
      likes: categoryLikes[name]
    }));

    // Post frequency by author
    const postsByAuthor: { [key: string]: number } = {};
    db.posts.forEach(p => {
      const auth = db.users.find(u => u.id === p.authorId);
      const name = auth ? auth.name : "Unknown";
      postsByAuthor[name] = (postsByAuthor[name] || 0) + 1;
    });

    const authorsStats = Object.keys(postsByAuthor).map(name => ({
      name,
      posts: postsByAuthor[name]
    }));

    res.json({
      summary: {
        posts: postsCount,
        users: usersCount,
        comments: commentsCount,
        likes: likesCount
      },
      popularCategories,
      authorsStats
    });
  });

  // --- DEV & PRODUCTION BUILD STATIC SERVING MIDDLEWARE ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Fallback for SPA routing in dev mode
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ error: "API Endpoint not found" });
    }
    next();
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BlogSphere Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
