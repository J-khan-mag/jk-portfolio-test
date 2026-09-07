/**
 * B1 — everything that is not architecture.
 *
 * Nothing about the work belongs on this level. Schools, qualifications,
 * software, competitions and anything professional live upstairs in The
 * Record and in level G. What is left here is a person: where he is from,
 * what he drives, what he plays, and what he does with the rest of the hours.
 */

export type Stop = { place: string; region: string; years: string; note: string };

/** places lived in — a plain timeline, nothing more */
export const TIMELINE: Stop[] = [
  {
    place: 'Shaidu',
    region: 'Nowshera, Pakistan',
    years: 'Born',
    note: 'A village in the north. Mountains on three sides, long winters, and everybody related to everybody.',
  },
  {
    place: 'Islamabad',
    region: 'Pakistan',
    years: '2013',
    note: 'Moved to the city on my own for the first time. Learned to cook badly and to argue properly.',
  },
  {
    place: 'Ankara',
    region: 'Turkey',
    years: '2015',
    note: 'Two years abroad on an exchange. Enough Turkish to order food, get a haircut and lose an argument.',
  },
  {
    place: 'Dubai',
    region: 'United Arab Emirates',
    years: '2020 —',
    note: 'Where I live now. Early mornings, long summers, and a road out of the city most weekends.',
  },
];

export type Aside = {
  key: string;
  title: string;
  meta: string;
  body: string;
  /** key into IMG — the portrait plate for this aside */
  image?: string;
  link?: { label: string; href: string };
};

export const ASIDES: Aside[] = [
  {
    key: 'cars',
    title: 'Mustang Knights',
    meta: 'Weekends · the car club',
    body:
      'A Mustang, and the club that comes with it. Early starts, a road out of the city, and a long argument in a car park afterwards about whether a thing is honest or merely fast.',
    image: 'mustang',
  },
  {
    key: 'komio',
    title: 'GameKomio',
    meta: 'Built and run on the side',
    body:
      'A browser arcade of twenty-three small games I made myself. No accounts, no downloads, no ads, no tracking — it runs in ten languages and saves your progress on your own device.',
    image: 'komio',
    link: { label: 'gamekomio.com', href: 'https://www.gamekomio.com/' },
  },
  {
    key: 'dota',
    title: 'Dota 2',
    meta: 'Late hours · ten years',
    body:
      'Five people, one map, and no way to win it alone. Ten years of it, and still the best argument I know that a plan is only as good as the four people who did not agree to it.',
    image: 'dota',
  },
  {
    key: 'chess',
    title: 'Chess',
    meta: 'The opposite of a team',
    body:
      'No team, no excuses, and a board that tells you exactly how wrong you were about twelve moves ago. I won the university championship on one of the good days.',
    image: 'chess',
  },
];

/** the rest of the hours */
export const INTERESTS = [
  'Sketching',
  'History and cultures',
  'Football',
  'Dota 2',
  'Chess',
  'Cars',
  'Film and music',
];

/** won, or nearly won, off the clock */
export const HONOURS = [
  { primary: 'University Chess Championship', secondary: 'Champion' },
  { primary: 'Faculty football team', secondary: 'Two seasons' },
];
