/**
 * The professional record, drawn from the CV.
 * Kept as data so it stays a spec sheet rather than prose.
 */

export const TITLE = 'Senior Architect';

export const SUMMARY =
  'Architect working between design and delivery, across visualisation, interior detailing, site supervision and development-side management. Multi-national practice — Pakistan, Turkey, Switzerland, Portugal, the United States and the UAE — and the inter-disciplinary exposure that comes with it.';

export type Entry = { primary: string; secondary?: string; note?: string };

export const CAPABILITIES: { label: string; note: string }[] = [
  {
    label: 'Design management',
    note: 'Holding the intent while the consultant team, the authority and the programme all pull at it.',
  },
  {
    label: 'Construction coordination',
    note: 'Shop drawings, mock-ups and site queries answered fast enough that the sequence never waits on a decision.',
  },
  {
    label: 'Procurement',
    note: 'Long-lead packages identified early, specified tightly and tracked to the day they land on site.',
  },
  {
    label: 'Delivery across scales',
    note: 'From a store fit-out to a resort district, with the same drawing standard applied to both.',
  },
];

export const SCOPE = [
  'Concept design',
  'Detail design',
  'Tender documents',
  'BoQs & specifications',
  'Site supervision & coordination',
  'Master planning',
  'MEP & structural coordination',
];

export const AUTHORITIES = ['DDA', 'DM', 'EMPOWER', 'DEWA', 'DCD'];

export const SOFTWARE = [
  'AutoCAD',
  'Revit — BIM LOD 350',
  '3ds Max',
  'SketchUp',
  'Lumion',
  'D5 Render',
  'Photoshop',
  'Premiere Pro',
];

export const EDUCATION: Entry[] = [
  {
    primary: 'B.Arch — COMSATS University',
    secondary: 'Islamabad, Pakistan',
    note: '2013 – 2018',
  },
  {
    primary: 'B.Arch, Erasmus+ exchange — METU',
    secondary: 'Ankara, Turkey',
    note: '2015 – 2017',
  },
  {
    primary: 'Higher Secondary — Army Public School Zamzama',
    secondary: 'Nowshera, Pakistan',
    note: '2011 – 2013',
  },
];

export const MEMBERSHIPS: Entry[] = [
  { primary: 'Pakistan Council of Architects and Town Planners', note: 'PCATP' },
  { primary: 'Society of Engineering, UAE' },
  { primary: 'Erasmus+ Member, EU' },
  { primary: 'Revit Certification' },
];

export const LANGUAGES: Entry[] = [
  { primary: 'Pashto', note: 'Native' },
  { primary: 'Urdu', note: 'Fluent' },
  { primary: 'English', note: 'Fluent' },
  { primary: 'Turkish', note: 'Basic' },
];

/** competition entries and awards — the work behind level G */
export const AWARDS: Entry[] = [
  {
    primary: 'AYDA Asian Young Designers Award',
    secondary: 'Top three projects, Pakistan',
  },
  { primary: 'Mosul Low-Cost Housing', secondary: 'Runner-up' },
  { primary: 'Inspireli Visualization Award', secondary: 'Entry' },
  { primary: 'Women Seerat Center', secondary: 'HEC' },
  { primary: 'Façade Design', secondary: 'Kingcrete' },
];
