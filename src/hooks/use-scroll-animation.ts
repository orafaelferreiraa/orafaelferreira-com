import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * True when the current document was prerendered at build time (SSG) and is
 * being hydrated. In that case content starts visible: the server rendered it
 * visible (no IntersectionObserver there) and hiding it again on hydration
 * would cause a flash and a className mismatch.
 */
const isHydratingPrerenderedPage = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.getElementById('root')?.firstElementChild !== null;
};

/**
 * Hook para animar elementos quando eles entram na viewport ao fazer scroll
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  // Start visible when the observer is unavailable (server render), when the page
  // was prerendered, or when the user prefers reduced motion — computed at mount
  // so we never call setState synchronously in the effect.
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof IntersectionObserver === 'undefined') return true;
    if (isHydratingPrerenderedPage()) return true;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Already visible (no observer, prerendered, or reduced-motion): nothing to animate.
    if (typeof IntersectionObserver === 'undefined') return;
    if (isVisible && triggerOnce) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Safety fallback for mobile/browser edge cases where observer may not fire.
    const fallbackTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          window.clearTimeout(fallbackTimer);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (element) {
        observer.unobserve(element);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isVisible is only read for the early-return guard
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
