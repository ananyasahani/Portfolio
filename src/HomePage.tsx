import { motion } from "framer-motion";
import { POSTS, formatDate } from "./posts-data";

// Shared page-entry animation variants
export const pageVariants = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

// Stagger container: children animate in one by one
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Home / Landing Page ────────────────────────────────────────────────────────
interface HomePageProps {
  onGoToBlog: () => void;
  onOpenPost: (slug: string) => void;
}

export function HomePage({ onGoToBlog, onOpenPost }: HomePageProps) {
  const featured = POSTS.slice(0, 3);

  return (
    <motion.div
      key="home"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <motion.p
          className="hero-eyebrow"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          Personal writing
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="hero-title"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          Ideas worth sitting with.
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.18 }}
        >
          Essays on thinking, technology, and the slow craft of paying attention.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.26 }}
        >
          <button className="hero-cta" onClick={onGoToBlog} id="hero-cta-btn">
            Read the writing
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </button>
        </motion.div>

        {/* Decorative label */}
        <span className="hero-rule" aria-hidden="true">est. 2026</span>
      </section>

      {/* ── About strip ── */}
      <motion.section
        className="about-strip"
        aria-label="About"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: 30 } as React.CSSProperties}
      >
        <p className="about-strip-label">About</p>
        <div className="about-strip-body">
          <p>
            I'm Ananya — I think slowly, read widely, and write when something
            feels worth saying. This site is my public notebook: no schedule, no
            algorithm, just ideas that have taken up enough space in my head to
            earn a page.
          </p>
          <p>
            I'm drawn to the edges between disciplines — where cognitive science
            meets productivity, where history meets technology, where the
            personal meets the structural.
          </p>
        </div>
      </motion.section>

      {/* ── Featured posts ── */}
      <section className="featured-strip" aria-labelledby="featured-heading">
        <div className="featured-header">
          <h2 id="featured-heading">Recent essays</h2>
          <button className="featured-all-link" onClick={onGoToBlog} id="see-all-btn">
            All writing →
          </button>
        </div>

        <motion.div
          className="featured-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {featured.map((post) => (
            <motion.div key={post.id} variants={fadeUp}>
              <button
                id={`featured-${post.slug}`}
                className="featured-card"
                onClick={() => onOpenPost(post.slug)}
                aria-label={`Read: ${post.title}`}
              >
                <p className="featured-card-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {" · "}
                  {post.readingTime}
                </p>
                <p className="featured-card-title">{post.title}</p>
                <p className="featured-card-excerpt">{post.excerpt}</p>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ananya</span>
        <span>Built with Bun &amp; React</span>
      </footer>
    </motion.div>
  );
}
