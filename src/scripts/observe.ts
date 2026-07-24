type Mode = 'hairline' | 'fade';

function onIntersect(el: Element, mode: Mode) {
  el.classList.add('is-in');
}

export function start(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('[data-observe]').forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const mode = (e.target as HTMLElement).dataset.observe as Mode | undefined;
        if (!mode) continue;
        onIntersect(e.target, mode);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll<HTMLElement>('[data-observe]').forEach((el) => io.observe(el));
}
