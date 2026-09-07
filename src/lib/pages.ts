import { LEVELS, PROJECTS, type Level, type LevelKey, type Project } from '../data/projects';
import type { Img } from '../data/images';

export type Page =
  | { kind: 'cover' }
  | { kind: 'statement' }
  | { kind: 'contents' }
  | { kind: 'divider-a'; level: Level; count: number }
  | { kind: 'divider-b'; level: Level; count: number }
  | { kind: 'project-a'; project: Project; index: number; frame: number }
  | { kind: 'project-b'; project: Project; index: number }
  | { kind: 'plate'; project: Project; image: Img; imageIndex: number; frame: number }
  | { kind: 'contact-a' }
  | { kind: 'contact-b' }
  | { kind: 'backcover' };

export type BuiltPages = {
  pages: Page[];
  /** spread index (i.e. number of leaves turned) that reveals a given project */
  spreadOf: Record<string, number>;
  /** spread index that reveals a given level divider */
  spreadOfLevel: Record<string, number>;
  /** printed folio number for a page index, or null for unnumbered pages */
  folioOf: (pageIndex: number) => number | null;
  leafCount: number;
};

/**
 * A page at index `i` sits on the RIGHT of spread `i / 2` when `i` is even,
 * and on the LEFT of spread `(i + 1) / 2` when `i` is odd.
 * So the spread that first shows page `i` is `Math.ceil(i / 2)`.
 */
const spreadShowing = (pageIndex: number) => Math.ceil(pageIndex / 2);

export function buildPages(): BuiltPages {
  const pages: Page[] = [];
  const spreadOf: Record<string, number> = {};
  const spreadOfLevel: Record<string, number> = {};

  pages.push({ kind: 'cover' });
  pages.push({ kind: 'statement' });
  pages.push({ kind: 'contents' });

  let n = 0;

  // G is the profile and B1 is the personal level; the printed volume stays work
  for (const level of LEVELS.filter((l) => l.key !== 'B1' && l.key !== 'G')) {
    const items = PROJECTS.filter((p) => p.level === level.key);
    spreadOfLevel[level.key] = spreadShowing(pages.length);
    pages.push({ kind: 'divider-a', level, count: items.length });
    pages.push({ kind: 'divider-b', level, count: items.length });

    for (const project of items) {
      n += 1;
      spreadOf[project.id] = spreadShowing(pages.length);
      const hero = project.images[0];
      pages.push({
        kind: 'project-a',
        project,
        index: n,
        // a hero plate takes a small crop down to 3:2 so it holds the page
        // against the text opposite rather than floating as a thin band
        frame: hero ? Math.min(hero.w / hero.h, 1.5) : 1.5,
      });
      pages.push({ kind: 'project-b', project, index: n });

      // Extra full-bleed plates, in pairs, for projects with deeper image sets.
      const rest = project.images.slice(3);
      const maxSpreads = level.key === '+4' ? 3 : 2;
      const plateSpreads = Math.min(maxSpreads, Math.floor(rest.length / 2));
      for (let s = 0; s < plateSpreads; s++) {
        const a = rest[s * 2];
        const b = rest[s * 2 + 1];
        // one shared frame for the pair: each plate takes a small, even crop so
        // the two line up exactly across the gutter
        const frame = Math.sqrt((a.w / a.h) * (b.w / b.h));
        pages.push({ kind: 'plate', project, image: a, imageIndex: 3 + s * 2, frame });
        pages.push({ kind: 'plate', project, image: b, imageIndex: 3 + s * 2 + 1, frame });
      }
    }
  }

  pages.push({ kind: 'contact-a' });
  pages.push({ kind: 'contact-b' });
  pages.push({ kind: 'backcover' });

  // Keep the leaf count whole so the back cover lands on a leaf back.
  if (pages.length % 2 !== 0) pages.push({ kind: 'backcover' });

  const folioOf = (i: number): number | null => {
    const p = pages[i];
    if (!p) return null;
    if (p.kind === 'cover' || p.kind === 'backcover' || p.kind === 'statement') return null;
    return i; // page 2 onward reads as its own index — simple and always consistent
  };

  return { pages, spreadOf, spreadOfLevel, folioOf, leafCount: pages.length / 2 };
}

export const levelOrder: LevelKey[] = LEVELS.map((l) => l.key);
