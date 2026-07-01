import { BookOpen, Github, Twitter, Linkedin, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (page: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-2">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Blog<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              </span>
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              BlogSphere is a premium blogging platform built with Spring Boot, React, and Tailwind CSS. Empowering developers, writers, and designers to share their knowledge, ideas, and stories with the world.
            </p>
            {/* Socials */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button onClick={() => onNavigate("home")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("blog")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Articles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button onClick={() => onNavigate("blog")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Technology
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("blog")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Programming
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("blog")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Design
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> using React, Spring Boot, & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
