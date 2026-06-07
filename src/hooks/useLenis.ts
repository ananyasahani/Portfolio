import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * useLenis — initialises a Lenis smooth-scroll instance and keeps its
 * RAF loop alive for the lifetime of the component that calls it.
 *
 * Returns the Lenis instance so callers can programmatically scroll
 * (e.g. lenis.scrollTo(0) on page navigation).
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // Smoothness: higher = more momentum, lower = snappier.
      lerp: 0.1,
      // Use the whole document as the scroll container.
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
