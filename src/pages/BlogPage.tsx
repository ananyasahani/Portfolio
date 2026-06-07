import { useState } from "react";
import { motion } from "framer-motion";
import { POSTS, formatDate, ALL_TAGS, type Post, type Section } from "../data/posts-data";
import { pageVariants, staggerContainer, fadeUp } from "./HomePage";

// ── Secure body renderer — no innerHTML ───────────────────────────────────────
function renderSection(section: Section, idx: number) {
  switch (section.type) {
    case "heading2":
      return <h2 key={idx}>{section.content as string}</h2>;
    case "heading3":
      return <h3 key={idx}>{section.content as string}</h3>;
    case "blockquote":
      return <blockquote key={idx}>{section.content as string}</blockquote>;
    case "ul":
      return (
        <ul key={idx}>
          {(section.content as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    default:
      return <p key={idx}>{section.content as string}</p>;
  }
}

// ── Blog List ─────────────────────────────────────────────────────────────────
interface BlogPageProps {
  onOpenPost: (slug: string) => void;
}

export function BlogPage({ onOpenPost }: BlogPageProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? POSTS.filter(p => p.tags.includes(activeTag)) : POSTS;

  return (
    <motion.div
      key="blog"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="blog-page">
        {/* Header */}
        <motion.header
          className="blog-page-header"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <h1>Writing</h1>
          <p>Notes on thinking, technology, and everything in between.</p>
        </motion.header>

        {/* Tag filters */}
        <motion.div
          className="tag-filters"
          role="group"
          aria-label="Filter by topic"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <button
            id="tag-all"
            className={`tag-pill${!activeTag ? " active" : ""}`}
            onClick={() => setActiveTag(null)}
            aria-pressed={!activeTag}
          >
            All
          </button>
          {ALL_TAGS.map(tag => (
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

        {/* Post list */}
        <motion.ol
          className="post-entries"
          aria-label="Posts"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filtered.length === 0 ? (
            <li style={{ paddingTop: "2rem", color: "var(--muted)", fontStyle: "italic" }}>
              No posts in this topic yet.
            </li>
          ) : (
            filtered.map(post => (
              <motion.li key={post.id} className="post-entry" variants={fadeUp}>
                <article>
                  <button
                    id={`post-btn-${post.slug}`}
                    className="post-entry-link"
                    onClick={() => onOpenPost(post.slug)}
                    aria-label={`Read: ${post.title}`}
                  >
                    <div className="post-entry-meta">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                      {post.tags.map(t => (
                        <span key={t} className="post-tag-badge">{t}</span>
                      ))}
                    </div>
                    <h2 className="post-entry-title">{post.title}</h2>
                    <p className="post-entry-excerpt">{post.excerpt}</p>
                    <span className="read-more">Read essay</span>
                  </button>
                </article>
              </motion.li>
            ))
          )}
        </motion.ol>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ananya</span>
        <span>Built with Bun &amp; React</span>
      </footer>
    </motion.div>
  );
}

// ── Single Post ───────────────────────────────────────────────────────────────
interface PostDetailProps {
  slug: string;
  onBack: () => void;
}

export function PostDetail({ slug, onBack }: PostDetailProps) {
  const post: Post | undefined = POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <motion.div
        key="post-404"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="post-content">
          <button className="back-btn" onClick={onBack}>Back to writing</button>
          <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Post not found.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`post-${slug}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="post-content">
        <motion.button
          className="back-btn"
          onClick={onBack}
          aria-label="Back to all posts"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          All writing
        </motion.button>

        <motion.header
          className="post-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1>{post.title}</h1>
          <div className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="dot" aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            {post.tags.map(t => (
              <span key={t} style={{ fontStyle: "italic" }}>{t}</span>
            ))}
          </div>
        </motion.header>

        <motion.div
          className="post-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {post.body.map((section, idx) => renderSection(section, idx))}
        </motion.div>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ananya</span>
        <span>Built with Bun &amp; React</span>
      </footer>
    </motion.div>
  );
}
