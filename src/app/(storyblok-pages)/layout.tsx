import React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary">
              <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-xl">
                B
              </span>
            </div>
            <span className="text-xl font-bold">BlogMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="w-[200px] pl-8 rounded-full bg-muted"
              />
            </div>
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md hover:bg-muted">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About BlogMaster</h3>
            <p className="text-muted-foreground">
              A modern blog platform showcasing the latest insights, tutorials,
              and stories from our community of writers and thinkers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/technology"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/category/design"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  href="/category/business"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  href="/category/lifestyle"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Subscribe to Newsletter
            </h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with our latest posts and announcements.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-r-none"
              />
              <Button className="rounded-l-none">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Social and Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://facebook.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://twitter.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://instagram.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BlogMaster. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
