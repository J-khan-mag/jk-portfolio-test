import { useEffect, type RefObject } from 'react';

/* one counter for every layer that wants the page held still — the intro,
   the panel, and a lightbox stacked on the panel can all hold it at once */
let locks = 0;

/* Hiding the scrollbar makes the page 15px wider on a classic-scrollbar
   system, so everything shifts sideways when the hold is released — at the
   very moment the entrance lands, or when a panel closes. The gutter's width
   is measured and given back as padding for as long as the hold lasts. */
export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  const gutter = window.innerWidth - document.documentElement.clientWidth;
  if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Dialog plumbing: locks the page scroll behind the dialog, moves focus into
 * it, keeps Tab cycling inside it, and puts focus back where it came from on
 * close. `active` lets a dialog hand the trap to one stacked above it.
 */
export function useModal(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const opener = document.activeElement as HTMLElement | null;
    lockScroll();
    el.focus({ preventScroll: true });

    return () => {
      unlockScroll();
      opener?.focus?.({ preventScroll: true });
    };
    // mount/unmount only — the trap below follows `active`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (current === first || !el.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !el.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [ref, active]);
}
