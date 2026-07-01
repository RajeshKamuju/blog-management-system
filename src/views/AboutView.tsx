import { BookOpen, Coffee, Layout, HardDrive, ShieldCheck, Database, Award } from "lucide-react";
import { motion } from "motion/react";

export default function AboutView() {
  return (
    <div id="about-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left space-y-16 pb-20 animate-in fade-in duration-300">
      
      {/* 1. Header Hero section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          About BlogSphere
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          BlogSphere is a state-of-the-art blogging ecosystem engineered specifically to showcase professional multi-layered full-stack application development.
        </p>
      </section>

      {/* 2. Platform Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Clean UI & Aesthetics</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Crafted with modern Tailwind CSS utilities and React 19 micro-animations, providing desktop-first precision and fluid dark-mode rendering.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Layered Spring Boot</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Structured Java REST endpoints processing transactions under clear Controller-Service-Repository separations, ensuring high-scale resilience.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Role-Based Security</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Guarded by Spring Security filters executing cryptographically signed JWT bearer authentication and BCrypt password encryption.
          </p>
        </div>
      </section>

      {/* 3. Deep Dive Tech Stack Specifications */}
      <section className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-3xl p-8 lg:p-10 shadow-sm space-y-8">
        <div className="border-b border-gray-100 dark:border-gray-900 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detailed System Architecture</h2>
          <p className="text-sm text-gray-500">How the BlogSphere stack components collaborate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5" /> Frontend Client Specs
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span><strong>Framework:</strong> React 19 SPA running on top of Vite Bundler.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span><strong>Styling Core:</strong> Tailwind CSS utilities + custom root system classes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span><strong>Micro-Animations:</strong> Motion transitions powering page mounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span><strong>Routing:</strong> Lightweight stateful hash-router supporting native history controls and browser refresh persistence.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Database className="w-4.5 h-4.5" /> Backend Service Specs
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span><strong>Framework:</strong> Spring Boot REST APIs with Maven Dependency build tool.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span><strong>Persistence/ORM:</strong> Spring Data JPA + Hibernate mapping native queries seamlessly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span><strong>Database Engine:</strong> Relational MySQL supporting indexed queries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span><strong>Security:</strong> Spring Security JWT verification filter injecting stateless authentication contexts.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Elegant Textual ERD representation */}
      <section className="bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-900 rounded-3xl p-8 lg:p-10 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" /> Relational Database Entity Diagram (ERD)
        </h2>
        <p className="text-sm text-gray-500">
          Entities relationships map matching MySQL schemas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-white dark:bg-gray-950 p-4 border border-gray-150 dark:border-gray-900 rounded-2xl">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider mb-2">User Entity</h4>
            <div className="font-mono text-[10px] text-gray-500 space-y-1">
              <p>🔑 id (PK)</p>
              <p>name</p>
              <p>username (Unique)</p>
              <p>email (Unique)</p>
              <p>passwordHash</p>
              <p>role (USER | ADMIN)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 border border-gray-150 dark:border-gray-900 rounded-2xl">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider mb-2">Post Entity</h4>
            <div className="font-mono text-[10px] text-gray-500 space-y-1">
              <p>🔑 id (PK)</p>
              <p>title</p>
              <p>excerpt</p>
              <p>content (Rich)</p>
              <p>category</p>
              <p>🔗 authorId (FK)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 border border-gray-150 dark:border-gray-900 rounded-2xl">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider mb-2">Comment Entity</h4>
            <div className="font-mono text-[10px] text-gray-500 space-y-1">
              <p>🔑 id (PK)</p>
              <p>text</p>
              <p>🔗 postId (FK)</p>
              <p>🔗 userId (FK)</p>
              <p>🔗 parentCommentId (FK)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 p-4 border border-gray-150 dark:border-gray-900 rounded-2xl">
            <h4 className="font-bold text-xs text-indigo-600 uppercase tracking-wider mb-2">Like Entity</h4>
            <div className="font-mono text-[10px] text-gray-500 space-y-1">
              <p>🔑 id (PK)</p>
              <p>🔗 postId (FK)</p>
              <p>🔗 userId (FK)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-gray-900 rounded-2xl text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-700 dark:text-gray-300">Entity Associations Rules:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
            <p>• One User can author Many Posts (1:N)</p>
            <p>• One User can submit Many Comments (1:N)</p>
            <p>• One Post can have Many Comments (1:N)</p>
            <p>• One Post can accumulate Many Likes (1:N)</p>
          </div>
        </div>
      </section>

      {/* 5. Team footer card */}
      <section className="text-center bg-indigo-600 text-white rounded-3xl p-8 lg:p-12 space-y-4">
        <Coffee className="w-8 h-8 mx-auto animate-bounce text-indigo-200" />
        <h2 className="text-2xl font-bold">Have Questions or Suggestions?</h2>
        <p className="text-sm text-indigo-100 max-w-lg mx-auto">
          This system was designed to provide a perfect boilerplate full-stack template. Check the Setup Instructions file located in the code directories to run the Java Spring Boot service locally.
        </p>
      </section>
    </div>
  );
}
