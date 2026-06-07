import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./useTheme";

export type Page = "home" | "blog" | "post" | "projects";

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ current, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  function go(page: Page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        {/* Brand */}
        <button
          className="nav-brand"
          onClick={() => go("home")}
          aria-label="Go to homepage"
        >
          Ananya
        </button>

        {/* Desktop links */}
        <ul className={`nav-links${menuOpen ? " open" : ""}`} role="list">
          <li>
            <button
              id="nav-home"
              className={`nav-link${current === "home" ? " active" : ""}`}
              onClick={() => go("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              id="nav-blog"
              className={`nav-link${current === "blog" || current === "post" ? " active" : ""}`}
              onClick={() => go("blog")}
            >
              Writing
            </button>
          </li>
          <li>
            <button
              id="nav-projects"
              className={`nav-link${current === "projects" ? " active" : ""}`}
              onClick={() => go("projects")}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "Dark Theme" : "Light Theme"}
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            style={
              menuOpen
                ? { transform: "translateY(6.5px) rotate(45deg)" }
                : undefined
            }
          />
          <span style={menuOpen ? { opacity: 0 } : undefined} />
          <span
            style={
              menuOpen
                ? { transform: "translateY(-6.5px) rotate(-45deg)" }
                : undefined
            }
          />
        </button>
      </nav>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 89,
              background: "rgba(0,0,0,0.15)",
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
