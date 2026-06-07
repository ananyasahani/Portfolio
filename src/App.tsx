import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar, type Page } from "./Navbar";
import { HomePage } from "./HomePage";
import { BlogPage, PostDetail } from "./BlogPage";
import { ProjectsPage } from "./ProjectsPage";
import { useLenis } from "./useLenis";
import "./index.css";

export function App() {
  const [page, setPage] = useState<Page>("home");
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const lenisRef = useLenis();

  function scrollToTop() {
    lenisRef.current?.scrollTo(0, { immediate: false });
  }

  function navigate(target: Page) {
    setPage(target);
    setCurrentSlug(null);
    scrollToTop();
  }

  function openPost(slug: string) {
    setCurrentSlug(slug);
    setPage("post");
    scrollToTop();
  }

  function backToBlog() {
    setPage("blog");
    setCurrentSlug(null);
    scrollToTop();
  }

  return (
    <>
      <Navbar current={page} onNavigate={navigate} />

      <main className="page-shell" id="main-content">
        {/* AnimatePresence enables exit animations when the page key changes */}
        <AnimatePresence mode="wait" initial={false}>
          {page === "home" && (
            <HomePage
              key="home"
              onGoToBlog={() => navigate("blog")}
              onOpenPost={openPost}
            />
          )}

          {page === "blog" && (
            <BlogPage
              key="blog"
              onOpenPost={openPost}
            />
          )}

          {page === "projects" && (
            <ProjectsPage key="projects" />
          )}

          {page === "post" && currentSlug && (
            <PostDetail
              key={`post-${currentSlug}`}
              slug={currentSlug}
              onBack={backToBlog}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
