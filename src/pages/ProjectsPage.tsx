import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, ALL_PROJECT_TAGS } from "@/data/projects-data";
import { pageVariants, staggerContainer, fadeUp } from "./HomePage";

export function ProjectsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? PROJECTS.filter(p => p.tags.includes(activeTag)) : PROJECTS;

  return (
    <motion.div
      key="projects"
      variants={pageVariants as any}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="blog-page">
        {/* Header */}
        <motion.header
          className="blog-page-header"
          variants={fadeUp as any}
          initial="initial"
          animate="animate"
        >
          <h1>Projects</h1>
          <p>A selection of things I've built, hacked, or designed.</p>
        </motion.header>

        {/* Tag filters */}
        <motion.div
          className="tag-filters"
          role="group"
          aria-label="Filter by technology"
          variants={fadeUp as any}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <button
            id="tag-all-projects"
            className={`tag-pill${!activeTag ? " active" : ""}`}
            onClick={() => setActiveTag(null)}
            aria-pressed={!activeTag}
          >
            All
          </button>
          {ALL_PROJECT_TAGS.map(tag => (
            <button
              key={tag}
              id={`tag-${tag}`}
              className={`tag-pill${activeTag === tag ? " active" : ""}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Project list */}
        <motion.div
          className="project-grid"
          aria-label="Projects"
          variants={staggerContainer as any}
          initial="initial"
          animate="animate"
        >
          {filtered.length === 0 ? (
            <p style={{ paddingTop: "2rem", color: "var(--muted)", fontStyle: "italic" }}>
              No projects match this filter.
            </p>
          ) : (
            filtered.map(project => (
              <motion.article key={project.id} className="project-card" variants={fadeUp as any}>
                <div className="project-card-header">
                  <h2 className="project-title">{project.title}</h2>
                  <span className="project-year" aria-hidden="true">{project.year}</span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <div className="project-tags">
                    {project.tags.map(t => (
                      <span key={t} className="post-tag-badge">{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">Live Site ↗</a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </motion.div>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ananya</span>
        <span>Built with Bun &amp; React</span>
      </footer>
    </motion.div>
  );
}
