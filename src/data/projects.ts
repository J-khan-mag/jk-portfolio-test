import { IMG, type Img } from './images';

export type LevelKey = '+4' | '+3' | '+2' | '+1' | 'M' | 'G' | 'B1';

export type Video = { src: string; poster: Img };

export type Project = {
  id: string;
  title: string;
  location: string;
  level: LevelKey;
  typology: string;
  status?: string;
  scope: string[];
  text: string;
  images: Img[];
  video?: Video;
};

export type Level = {
  key: LevelKey;
  name: string;
  subtitle: string;
  blurb: string;
  /** the plate that opens the chapter — chosen, not inherited from the first project */
  cover: Img;
};

export const LEVELS: Level[] = [
  {
    key: '+4',
    name: 'In Development',
    subtitle: 'Under construction',
    blurb:
      'Live projects on site. Design management, construction coordination and procurement of long-lead packages, carried from consultant drawings through to installed work.',
    cover: IMG['ket-resort'][0],
  },
  {
    key: '+3',
    name: 'Built',
    subtitle: 'Completed and occupied',
    blurb:
      'Work delivered to completion — retail, hospitality, healthcare, cultural and residential interiors taken from first sketch through tender, site supervision and handover.',
    cover: IMG['p04'][1],
  },
  {
    key: '+2',
    name: 'Design Development',
    subtitle: 'Concept to authority approval',
    blurb:
      'Schemes developed to feasibility, authority submission or tender: towers, masterplans, villas and interiors, tested through visualisation and coordinated with structure and services.',
    cover: IMG['p21'][0],
  },
  {
    key: '+1',
    name: 'Academic',
    subtitle: 'Thesis and studio work',
    blurb:
      'University projects concerned with terrain, climate and cost — where the questions were allowed to stay open longer than a programme normally permits.',
    cover: IMG['p51'][0],
  },
  {
    key: 'M',
    name: 'Competitions & Experimental',
    subtitle: 'Entries and open studies',
    blurb:
      'Work made to argue a point rather than to fill a brief — concept studies run for their own sake into form, section and light, alongside the competition record.',
    cover: IMG['p45'][1],
  },
  {
    key: 'G',
    name: 'The Record',
    subtitle: 'Profile & capabilities',
    blurb:
      'The person behind the drawings — role, education, memberships, languages, scope and tools, set out plainly at ground level.',
    cover: IMG['p34'][0],
  },
  {
    key: 'B1',
    name: 'Basement',
    subtitle: 'Everything else',
    blurb:
      'Below the work: where it started, and what else takes up the hours.',
    cover: IMG['p45'][0],
  },
];

export const PROJECTS: Project[] = [
  // ────────────────────────────────  +4  IN DEVELOPMENT  ────────────────────────────────
  {
    id: 'keturah-resort',
    title: 'Keturah Resort',
    location: 'Ras Al Khor, Dubai Creek, UAE',
    level: '+4',
    typology: 'Resort & branded residences',
    status: 'Under construction',
    scope: [
      'Construction coordination',
      'Design management',
      'Procurement & long-lead items',
      'Consultant coordination',
      'Site progress review',
      'Shop drawing review',
    ],
    text:
      'A wellness-certified resort district laid along Dubai Creek, facing the flamingo shallows of the Ras Al Khor sanctuary. Low-rise residential terraces step down to a waterfront promenade and private marina, with mansions, a hotel and a members’ club threaded onto one continuous landscape spine rather than composed as separate objects. Current role covers construction coordination on site, management of the design consultant package, and procurement of long-lead finishes and specialist trades.',
    images: IMG['ket-resort'],
  },
  {
    id: 'keturah-reserve',
    title: 'Keturah Reserve',
    location: 'District 7, MBR City, Meydan, Dubai, UAE',
    level: '+4',
    typology: 'Residential masterplan',
    status: 'Under construction',
    scope: [
      'Construction coordination',
      'Design management',
      'Procurement & long-lead items',
      'Authority & infrastructure coordination',
      'Site progress review',
      'Material & mock-up approvals',
    ],
    text:
      'A bio-living community of townhouses, signature villa plots and apartment courts organised around a central park of mature olive trees. Each home is planned around a private garden room, so landscape reads continuously from the street through the plan and out to the roof deck. Role spans construction coordination, design management across the consultant team, and procurement tracking of finishes, joinery and landscape packages.',
    // the infrastructure layout sheet is site information, not a plate
    images: IMG['ket-reserve'].filter((_, i) => i !== 6),
    video: { src: '/media/keturah-reserve.mp4', poster: IMG['vid-reserve'][0] },
  },

  // ────────────────────────────────  +3  BUILT  ────────────────────────────────
  {
    id: 'sky-view-observatory',
    title: 'Sky View Observatory',
    location: 'Downtown, Dubai, UAE',
    level: '+3',
    typology: 'Observation & hospitality',
    scope: ['MEP coordination', 'Tender review', 'Site supervision', 'Project management'],
    text:
      'An observation and hospitality level at the crown of the Sky View towers. A woven brass-toned lattice wraps the spiral stair and rises through a circular light well, carrying the eye up before the city is revealed sideways. Delivery meant coordinating services against a very shallow ceiling zone, reviewing tender returns and supervising the fit-out on site.',
    images: [IMG['p04'][1], IMG['p04'][0]],
  },
  {
    id: 'light-of-sakina',
    title: 'Light of Sakina',
    location: 'The Dubai Mall, Dubai, UAE',
    level: '+3',
    typology: 'Retail',
    scope: ['All design phases', '3D visualisation', 'Materials & specifications', 'Site supervision', 'Project management'],
    text:
      'A fragrance and gifting store built from a wall of pointed-arch niches, each lit as its own vitrine so the range reads as a collection of small illuminated rooms rather than shelved stock. Warm plaster and brushed brass keep the shell quiet. Taken from concept through visualisation, specification and site supervision.',
    images: [IMG['p05'][1], IMG['p05'][0]],
  },
  {
    id: 'bordomavi-brix',
    title: 'Bordomavi + Brix Café',
    location: 'Jumeirah 1, Dubai, UAE',
    level: '+3',
    typology: 'Food & beverage',
    scope: ['Shop drawings', 'Materials & specifications', 'On-site consultancy', 'Project management'],
    text:
      'Two cafés at one address, given two atmospheres. A timber-battened pergola throws a moving grid of shadow across the dining floor, while the adjoining room stays pale, planted and top-lit. Delivered through shop drawings, material specification and on-site consultancy.',
    images: IMG['p06'],
  },
  {
    id: 's-residence',
    title: 'S-Residence',
    location: 'DHA, Lahore, Pakistan',
    level: '+3',
    typology: 'Private residence',
    scope: ['All design phases', '3D visualisation', 'Materials & specifications', 'MEP + structural coordination', 'Project management'],
    text:
      'A family house composed as two stone-clad volumes held apart by a recessed timber entrance. A screened upper terrace filters the western sun without closing the house off from the street. Carried through every design stage with structural and services coordination and a full working drawing set.',
    images: [IMG['p07'][1], IMG['p07'][0]],
  },
  {
    id: 'kababji',
    title: 'Kababji Restaurant',
    location: 'Sheikh Zayed Road, Dubai, UAE',
    level: '+3',
    typology: 'Food & beverage',
    scope: ['All design phases', '3D visualisation', 'Materials & specifications', 'Site supervision', 'Project management'],
    text:
      'A large-format grill house behind a limestone facade carrying incised figurative reliefs. Inside, a deep dining hall is broken down by banquette runs and a low field of pendants, so a room built for volume still eats at the scale of a table. Delivered across all design stages through to site supervision.',
    images: IMG['p08'],
  },
  {
    id: 'safeer-mall',
    title: 'Safeer Mall Renovation',
    location: 'Sharjah, UAE',
    level: '+3',
    typology: 'Retail — refurbishment',
    scope: ['Interior design', 'Exterior modifications', 'Spatial configuration', 'Material selection', 'MEP coordination'],
    text:
      'A re-skin and interior reconfiguration of an existing mall, reopened as Mall of Geepas. A folded, back-lit ceiling replaces the old atrium soffit and pulls daylight down through the void, while the retail spine was re-planned onto a single continuous datum. Scope ran from spatial configuration and material selection to services coordination.',
    images: IMG['p09'],
  },
  {
    id: 'volte-gallery',
    title: 'Volte Gallery',
    location: 'Alserkal Avenue, Dubai, UAE',
    level: '+3',
    typology: 'Cultural',
    scope: ['Concept development', 'Detail design', 'Construction documents', 'MEP coordination', 'Site supervision'],
    text:
      'A gallery inside a converted warehouse, kept deliberately mute — white walls, a flush poured floor, and services buried so completely that the work sets the scale of the room. The only designed events are the thresholds. Concept through construction documentation and site supervision.',
    images: IMG['p11'],
  },
  {
    id: 'kings-college-clinic',
    title: 'King’s College Clinic',
    location: 'Dubai Marina, Dubai, UAE',
    level: '+3',
    typology: 'Healthcare',
    scope: ['All design phases', '3D visualisation', 'Materials & specifications', 'On-site consultancy', 'Project management'],
    text:
      'An aesthetics clinic planned around a single curved solid-surface reception that turns arrival into one continuous gesture and hides the waiting area behind its own radius. Delivered through all design stages, with detailed junction drawings and material specification.',
    images: IMG['p12'],
  },

  {
    id: 'faizan-residence',
    title: 'Faizan Residence',
    location: 'Top City, Islamabad, Pakistan',
    level: '+3',
    typology: 'Private residence',
    scope: ['3D visualisation', 'Working drawings', 'Project management & consultancy'],
    text:
      'A compact urban house on a tight plot, stacked as three offset white volumes with a recessed entrance cut into the base. The living level opens fully to a rear terrace to compensate for a narrow frontage. Carried through working drawings and built.',
    images: [IMG['p18'][1], IMG['p18'][0]],
  },
  {
    id: 'khan-residence',
    title: 'Khan Residence',
    location: 'Bahria Town, Rawalpindi, Pakistan',
    level: '+3',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'All design stages', 'Municipality approvals', 'Finishes & lighting specification'],
    text:
      'A house built from a dark timber-and-glass upper storey resting on a pale stone base, with a covered forecourt that works as the real front room for most of the year. Planned, documented and built.',
    images: IMG['p41'],
  },
  {
    id: 'villa-loota',
    title: 'Villa Loota',
    location: 'Nad Al Sheba, Dubai, UAE',
    level: '+3',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'Concept design', 'Municipality approvals', 'Finishes & lighting specification'],
    text:
      'A villa and detached majlis set as two lit horizontal slabs against a dark site, with the guest wing separated so that formal hospitality never enters the family house. Lighting was specified as part of the massing, not after it.',
    images: IMG['p38'],
  },

  // ────────────────────────────────  +2  DESIGN DEVELOPMENT  ────────────────────────────────
  {
    id: 'geepas-residence-al-barsha',
    title: 'Geepas Residence',
    location: 'Al Barsha, Dubai, UAE',
    level: '+2',
    typology: 'Private residence — interiors',
    scope: ['3D visualisation', 'Working drawings', 'Project management & consultancy'],
    text:
      'Interiors for a large family villa, held together by book-matched stone panels and a restrained palette of bronze, plaster and pale timber. Reception rooms are treated formally and symmetrically; private rooms are softened and lowered. Documented to working drawings alongside the visualisation set.',
    images: [...IMG['p14'], ...IMG['p15']],
  },
  {
    id: 'geepas-residence-al-barsha-3',
    title: 'Geepas Residence II',
    location: 'Al Barsha 3, Dubai, UAE',
    level: '+2',
    typology: 'Private residence',
    scope: ['Planning', 'Concept design', 'Authority submissions', 'MEP & structural coordination'],
    text:
      'A courtyard-planned villa arranged so that guest, family and service routes never cross. The plan holds a pool court at its centre and pushes circulation to the perimeter, keeping the deep plan daylit. Developed to authority submission with structural and services coordination.',
    images: IMG['p16'],
  },
  {
    id: 'dha-clinic',
    title: 'DHA Clinic',
    location: 'Zabeel, Dubai, UAE',
    level: '+2',
    typology: 'Healthcare',
    scope: ['3D visualisation', 'Materials & specifications', 'On-site consultancy', 'Project management'],
    text:
      'A primary-care clinic that avoids the usual institutional read. A ribboned reception desk, planted screens and a perforated partition break the waiting hall into smaller, less exposed pockets while keeping sightlines open for staff.',
    images: IMG['p17'],
  },
  {
    id: 'geepas-residence-seih-shuaib',
    title: 'Geepas Residence III',
    location: 'Seih Shuaib, Dubai, UAE',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation', 'Concept design', 'Authority submissions'],
    text:
      'A long, low villa laid along its plot boundary so the entire remaining site becomes one pool garden. Deep roof overhangs and a stone-and-timber base give the elevation weight without height. Developed to concept and authority submission.',
    images: IMG['p19'],
  },
  {
    id: 'al-nasr-sports-academy',
    title: 'Al Nasr Sports Academy',
    location: 'Oud Metha, Dubai, UAE',
    level: '+2',
    typology: 'Sports & education',
    scope: ['3D visualisation & animation', 'Concept development', 'Spatial analysis', 'Feasibility calculations'],
    text:
      'A training academy whose long facade is cut by a repeating arched arcade, giving a very deep building a shaded, walkable edge. Internally the plan is a single loaded corridor serving halls, changing and teaching rooms. Tested through feasibility and area analysis.',
    images: IMG['p20'],
  },
  {
    id: 'air-link-tower',
    title: 'Air-Link Tower',
    location: 'Downtown, Dubai, UAE',
    level: '+2',
    typology: 'Mixed-use tower',
    scope: ['3D visualisation & animation', 'Concept development', 'Mixed-use spatial organisation', 'Feasibility calculations'],
    text:
      'A mixed-use tower faceted into a folded, scaled skin that shifts sharply with the sun’s angle. Office, serviced apartment and amenity floors are stacked with the amenity band pulled out as a visible break in the shaft. Developed through massing studies and feasibility calculations.',
    images: IMG['p21'],
  },
  {
    id: 'jebel-ali-apartments',
    title: 'Jebel Ali Apartments',
    location: 'Jebel Ali, Dubai, UAE',
    level: '+2',
    typology: 'Residential',
    scope: ['3D visualisation & animation', 'Concept development', 'Mixed-use spatial organisation', 'Feasibility calculations'],
    text:
      'A mid-rise residential block with retail at grade, where a shallow horizontal fin runs the full length of each floor to shade the glazing and stretch the building visually along the street. Efficiency-driven: circulation cores were fixed early from unit-mix calculations.',
    images: IMG['p22'],
  },
  {
    id: 'rak-hotel',
    title: 'RAK Hotel',
    location: 'Al Hamriya, Ras Al Khaimah, UAE',
    level: '+2',
    typology: 'Hospitality',
    scope: ['3D visualisation & animation', 'Concept development', 'Mixed-use spatial organisation', 'Feasibility calculations'],
    text:
      'A curved glass hotel wrapped by a planted ribbon that spirals from the podium to the roof terrace, giving every third floor an external garden. The sweep of the plan also opens the maximum number of rooms toward the water.',
    images: IMG['p23'],
  },
  {
    id: 'rak-apartments',
    title: 'RAK Apartments',
    location: 'Al Hamriya, Ras Al Khaimah, UAE',
    level: '+2',
    typology: 'Residential',
    scope: ['3D visualisation & animation', 'Concept development', 'Mixed-use spatial organisation', 'Feasibility calculations'],
    text:
      'A residential tower built from stacked curved balcony trays that thin as they rise. The continuous slab edge does the shading work, so the facade needs no secondary screen. Massing and unit mix resolved against feasibility targets.',
    images: IMG['p24'],
  },
  {
    id: 'pc-hotel',
    title: 'P.C. Hotel',
    location: 'Karachi, Pakistan',
    level: '+2',
    typology: 'Hospitality',
    scope: ['3D visualisation', 'Concept development', 'Hospitality development', 'Spatial analysis'],
    text:
      'A hotel proposal held as one deep white fluted volume, entered beneath a single tall arch that lifts out of the vertical rhythm. The fluting is structural in appearance and solar in purpose, keeping glazing recessed on all exposed faces.',
    images: IMG['p25'],
  },
  {
    id: 'casa-de-azulejos',
    title: 'Casa de Azulejos',
    location: 'Lisbon, Portugal',
    level: '+2',
    typology: 'Adaptive reuse',
    scope: ['3D visualisation & animation', 'Concept development', 'Revitalisation of existing structure'],
    text:
      'The revitalisation of a Lisbon townhouse, keeping the tiled street facade intact while gutting and rebuilding behind it. New floors are inserted as a raw concrete lining, and a perforated screen brings borrowed light deep into a plan that only fronts the street.',
    images: IMG['p26'],
  },
  {
    id: 'beco-da-vida',
    title: 'Beco da Vida',
    location: 'Lisbon, Portugal',
    level: '+2',
    typology: 'Adaptive reuse',
    scope: ['3D visualisation & animation', 'Concept development', 'Revitalisation of existing structure'],
    text:
      'A narrow infill building on a Lisbon alley, reworked around a single yellow stair that runs the full height as the only strong colour in an otherwise white shell. Shared thresholds and a notice wall are treated as designed social equipment rather than leftovers.',
    images: IMG['p27'],
  },
  {
    id: 'g4-seih-shuaib',
    title: 'G+4 Residential',
    location: 'Seih Shuaib, Dubai, UAE',
    level: '+2',
    typology: 'Residential',
    scope: ['3D visualisation', 'Concept development', 'Structural & MEP coordination'],
    text:
      'A five-storey residential block that lifts its amenity deck and pool to the roof to free the whole ground plane for parking and landscape. Balcony recesses are cut back on the exposed elevations to keep the shading self-made.',
    images: IMG['p28'],
  },
  {
    id: 'hamriya-masterplan',
    title: 'Al Hamriya Masterplan',
    location: 'Al Hamriya, Ras Al Khaimah, UAE',
    level: '+2',
    typology: 'Masterplan',
    scope: ['3D visualisation & animation', 'Concept development', 'Master planning', 'Zoning & infrastructure'],
    text:
      'A waterfront masterplan built around a domed arena as its civic anchor, with a fringe of low resort development reaching into the water on constructed spurs. Zoning, density and infrastructure corridors were set before any building form was fixed.',
    images: IMG['p29'],
  },
  {
    id: 'hideout-masterplan',
    title: 'Hide-Out Masterplan',
    location: 'Al Khawaneej, Dubai, UAE',
    level: '+2',
    typology: 'Masterplan',
    scope: ['3D visualisation & animation', 'Concept development', 'Master planning', 'Spatial calculations'],
    text:
      'A low-rise retreat masterplan built from a hexagonal tiling, where each cell is either a courtyard dwelling, a planted roof or an open garden. Density is tuned by swapping cell types rather than changing the geometry — so the plan stays legible as it grows.',
    images: IMG['p30'],
  },
  {
    id: 'al-nasr-masterplan',
    title: 'Al Nasr Masterplan',
    location: 'Oud Metha, Dubai, UAE',
    level: '+2',
    typology: 'Masterplan',
    scope: ['3D visualisation', 'Concept development', 'Master planning', 'Spatial calculations'],
    text:
      'A masterplan for an existing sports club district, re-organising pitches, courts and a stadium against new commercial frontage. The study tested how much development the site could absorb before the playing fields lost their continuity.',
    images: IMG['p31'],
  },
  {
    id: 'tidal-mill',
    title: 'Tidal Mill Revitalisation',
    location: 'Seixal, Lisbon, Portugal',
    level: '+2',
    typology: 'Heritage & adaptive reuse',
    scope: ['3D visualisation', 'Renovation & revitalisation', 'Concept development', 'Master planning'],
    text:
      'The reworking of a historic tidal mill on the Seixal estuary into a public building, keeping the existing white masonry silhouette and the working relationship with the tide. New interventions sit low and read as a separate, reversible layer.',
    images: IMG['p32'],
  },
  {
    id: 'sequoia-cafe',
    title: 'Sequoia Café',
    location: 'California, USA',
    level: '+2',
    typology: 'Food & beverage',
    scope: ['3D visualisation & animation', 'Concept development', 'Real estate development'],
    text:
      'A small roadside café in timber, with a deep awning and a full-width glazed front so the whole interior works as its own signage. Designed as a repeatable unit — the structure, joinery and canopy can be rebuilt on other plots.',
    images: IMG['p33'],
  },
  {
    id: 'hortman-office',
    title: 'Hortman Office',
    location: 'Al Barsha, Dubai, UAE',
    level: '+2',
    typology: 'Workplace',
    scope: ['3D visualisation & animation', 'Concept development', 'Corporate interior design', 'Swiss minimalist detailing'],
    text:
      'A workplace fit-out taken to a deliberately Swiss level of restraint: white throughout, circular acoustic discs on an exposed soffit, and desking left free-standing so the floor plate can be re-set without touching the shell.',
    images: IMG['p34'],
  },
  {
    id: 'dha-mosque',
    title: 'DHA Mosque',
    location: 'DHA, Karachi, Pakistan',
    level: '+2',
    typology: 'Religious',
    scope: ['3D visualisation & animation', 'Concept design', 'Municipality approvals', 'Structural coordination'],
    text:
      'A neighbourhood mosque reduced to two moves — a low arcaded prayer hall and a single sharply tapered minaret. At night the arcade is washed from below so the building reads as a lit colonnade before it reads as a mass.',
    images: IMG['p35'],
  },
  {
    id: 'wa-office',
    title: 'WA Office',
    location: 'Downtown, Dubai, UAE',
    level: '+2',
    typology: 'Workplace',
    scope: ['3D visualisation & animation', 'Concept development', 'Corporate interior design'],
    text:
      'A corporate floor organised around a continuous light line that runs from reception through the open plan, doing the wayfinding that signage usually does. Stone, smoked glass and dark timber keep the executive zone distinct without walling it off.',
    images: IMG['p36'],
  },
  {
    id: 'james-residence',
    title: 'James Residence',
    location: 'California, USA',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'Concept development', 'Real estate development'],
    text:
      'A hillside house that sits on a stone retaining base and cantilevers a single glazed living bar out over the slope. Everything served — bedrooms, plant, garaging — is buried in the podium so the visible house stays one clean horizontal.',
    images: IMG['p37'],
  },
  {
    id: 'villa-28',
    title: 'Villa 28',
    location: 'DHA, Lahore, Pakistan',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'All design phases', 'MEP coordination', 'Municipality approvals'],
    text:
      'A white villa reduced to intersecting planes, fronted by a still reflecting pool that doubles the elevation and cools the approach. Minimal detailing throughout — flush reveals, hidden gutters, no visible trim. Carried through all design phases to approval.',
    images: IMG['p39'],
  },
  {
    id: 'saras-residence',
    title: 'Sara’s Residence',
    location: 'DHA, Islamabad, Pakistan',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'All design phases', 'MEP coordination', 'Municipality approvals'],
    text:
      'A classically detailed white house, symmetrical to the street and stepped back at the upper floor to keep the cornice line low. Proportion and moulding profiles were drawn out in full rather than borrowed from catalogue sections.',
    images: IMG['p40'],
  },
  {
    id: 'palm-residence',
    title: 'Palm Residence',
    location: 'Palm Jumeirah, Dubai, UAE',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation & animation', 'Concept design', 'Design options', 'Municipality approvals', 'Structural coordination'],
    text:
      'A beachfront house on a Palm frond, developed through several parallel options that all hold the same principle: living space runs the full width of the plot toward the water, and service rooms are pressed against the party walls. Studied in plan, axonometric and full render before a single option was carried to approval.',
    images: [...IMG['p42'], ...IMG['p43'], ...IMG['p10']],
  },
  {
    id: 'v8-villa',
    title: 'V8 Villa',
    location: 'California, USA',
    level: '+2',
    typology: 'Interior design',
    scope: ['Interior design', '3D visualisation', 'Mood boards', 'Material selection'],
    text:
      'Interiors for a hillside villa, kept pale and low-contrast so the landscape outside supplies the colour. Copper pendants and a floating timber stair are the only warm notes in an otherwise plaster-and-linen palette.',
    images: IMG['p44'],
  },
  {
    id: 'concrete-study',
    title: 'Concrete Study',
    location: 'Research series',
    level: 'M',
    typology: 'Visualisation research',
    scope: ['Visualisation', 'Modern + medieval series', 'Ray-tracing study'],
    text:
      'A self-directed lighting study: the same board-marked concrete rooms rendered against modern and medieval subjects to test how far material realism can carry a scene with almost no furniture in it. Ray-traced, with the figure used purely as a light meter.',
    images: IMG['p45'],
  },
  {
    id: 'house-17',
    title: 'House No. 17',
    location: 'F-7, Islamabad, Pakistan',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation', 'All design stages', 'Municipality approvals', 'Material specification'],
    text:
      'A city house in stone and timber, with a deep first-floor balcony cut into the mass to give shelter on the street side. The material change is used to mark the structural line rather than as applied decoration.',
    images: IMG['p46'],
  },
  {
    id: 'house-n',
    title: 'House N’',
    location: 'Jumeirah, Dubai, UAE',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation', 'Concept design', 'Municipality approvals', 'Material specification'],
    text:
      'A villa studied as a cutaway axonometric so client conversations could happen about the section rather than the elevation. Bedrooms wrap a planted court; the pool is set into the roof terrace to keep the ground plane as garden.',
    images: IMG['p47'],
  },
  {
    id: '25x50-haus',
    title: '25×50 Haus',
    location: 'E-11, Islamabad, Pakistan',
    level: '+2',
    typology: 'Private residence',
    scope: ['3D visualisation', 'Design options', 'All design stages', 'Municipality approvals'],
    text:
      'One standard 25×50 ft plot, drawn twice — once contemporary, once classical — on an identical plan, to let the client choose a language without re-litigating the layout. Both options were taken to the same level of resolution and cost.',
    images: IMG['p48'],
  },

  // ────────────────────────────────  +1  ACADEMIC  ────────────────────────────────
  {
    id: 'farmhouse-bani-gala',
    title: 'Farmhouse',
    location: 'Bani Gala, Islamabad, Pakistan',
    level: '+1',
    typology: 'Residential — studio',
    scope: ['Concept design', 'Schematic drawings', 'Site analysis', 'Green building'],
    text:
      'A single long glazed pavilion laid across a contour so that the roof stays level while the ground falls away beneath it. The section does the work: the building is entered at grade at one end and stands clear of the slope at the other.',
    images: IMG['p50'],
  },
  {
    id: 'cinematic-museum',
    title: 'Cinematic Museum',
    location: 'Shakarparian, Islamabad, Pakistan',
    level: '+1',
    typology: 'Cultural — thesis',
    scope: ['Thesis design', 'Schematic drawings', 'Site analysis', 'Project feasibility', 'Structural systems'],
    text:
      'A thesis museum of film, planned radially around a central drum so that galleries, archive and auditoria are all reached from one turning circulation. Half-buried into the Shakarparian ridge, it presents a landform to the city and reveals itself only from above.',
    images: IMG['p51'],
  },
  {
    id: 'smart-housing-ankara',
    title: 'Smart Housing',
    location: 'Ankara, Turkey',
    level: '+1',
    typology: 'Urban housing — studio',
    scope: ['Spatial configuration', 'Urban scale', 'Site analysis', 'Communal systems', 'Structural systems'],
    text:
      'Terraced housing cut into a sloping site, with parking and services buried under the deck and a constructed wetland garden used to treat run-off before it reaches the valley. Solar gain, cycle routes and shared decks were fixed in section before the plan was drawn.',
    images: IMG['p52'],
  },
  {
    id: 'cost-efficient-housing',
    title: 'Cost-Efficient Housing',
    location: 'Bani Gala, Islamabad, Pakistan',
    level: '+1',
    typology: 'Social housing — studio',
    scope: ['Spatial configuration', 'Urban scale', 'Site analysis', 'Passive ventilation', 'Low cost'],
    text:
      'Low-cost apartments built from one repeated unit and one repeated structural bay, varied only by an open brick screen that shades, ventilates and gives each dwelling a recognisable front. The section relies on cross-ventilation rather than mechanical cooling.',
    images: IMG['p53'],
  },
  // ────────────────────────────────  G  COMPETITIONS & EXPERIMENTAL  ────────────────────────────────
  {
    id: 'great-hall',
    title: 'The Great Hall',
    location: 'Concept scene',
    level: 'M',
    typology: 'Cinematic environment — concept',
    scope: ['Concept scene', 'Lighting study', 'Set dressing', 'Animation'],
    text:
      'The medieval side of the Concrete Study, taken all the way: a stone great hall built as a full cinematic set, lit by a single candle ring and two shafts of window light, and staged with figures so the architecture is read at the scale of a person. The room is the argument — how little light a space this size actually needs before it starts to speak.',
    images: IMG['medieval-hall'],
    video: { src: '/media/great-hall.mp4', poster: IMG['vid-hall'][0] },
  },
  {
    id: 'hillside-reserve',
    title: 'Hillside Reserve',
    location: 'Concept study',
    level: 'M',
    typology: 'Resort masterplan',
    scope: ['Concept masterplan', 'Terrain strategy', 'Animation', 'Feasibility massing'],
    text:
      'A low-rise resort community laid into an arid hillside, the plan following contours rather than cutting across them so that every roof sits below the ridge line behind it. Courtyard villas step down the slope in terraces, held together by a single looping road and a chain of water gardens in the valley floor.',
    images: IMG['vid-hillside'],
    video: { src: '/media/hillside-reserve.mp4', poster: IMG['vid-hillside'][0] },
  },
  {
    id: 'vale-verde',
    title: 'Vale Verde',
    location: 'Concept study',
    level: 'M',
    typology: 'Urban masterplan — concept',
    scope: ['Self-initiated study', 'Master planning', 'Density study', 'Landscape strategy'],
    text:
      'A concept district on a river edge, planned as perimeter blocks loose enough to let a continuous green corridor run through them. Density is pushed to the avenue and released towards the water, so the public rooms of the scheme are the gaps rather than the buildings.',
    images: IMG['comp-1'],
  },
  {
    id: 'cross-section-housing',
    title: 'Cross-Section Housing',
    location: 'Concept study',
    level: 'M',
    typology: 'Housing — sectional study',
    scope: ['Self-initiated study', 'Sectional study', 'Environmental strategy', 'Servicing'],
    text:
      'A study drawn only in section: how far a housing block can be run on stack ventilation, planted terraces and a shared thermal core before mechanical plant becomes unavoidable. The drawing is the argument — every floor is cut open so the servicing has to be shown rather than described.',
    images: IMG['comp-2'],
  },
  {
    id: 'helix-tower',
    title: 'Helix Tower',
    location: 'Concept study',
    level: 'M',
    typology: 'Tower — concept',
    scope: ['Concept study', 'Massing', 'Facade study', 'Feasibility'],
    text:
      'A residential tower whose floor plates rotate a fraction of a degree at a time, so that every apartment gets a terrace carved out of the slab above it and no two levels present the same face to the sun. The twist is set by the shading requirement, not by the silhouette.',
    images: IMG['comp-3'],
  },
  {
    id: 'ridge-housing',
    title: 'Ridge Housing',
    location: 'Concept study',
    level: 'M',
    typology: 'Housing — massing study',
    scope: ['Concept study', 'Massing model', 'Urban grain', 'Phasing'],
    text:
      'A study tested entirely as a white massing model: courtyard housing worked at three densities against the same plot, to find where the grain stops feeling like a street and starts feeling like an estate. The chosen grain was the tightest one that still let a car turn.',
    images: IMG['comp-4'],
  },
  {
    id: 'winter-garden',
    title: 'The Winter Garden',
    location: 'Experimental study',
    level: 'M',
    typology: 'Public interior — experimental',
    scope: ['Experimental study', 'Environmental section', 'Structure', 'Planting strategy'],
    text:
      'A glazed room held between two housing blocks and kept warm enough to plant, so that the circulation everyone uses in winter is also the only green space they can reach without going outside. A study in whether shared space pays for its own heating.',
    images: IMG['comp-5'],
  },
];

export const byLevel = (k: LevelKey) => PROJECTS.filter((p) => p.level === k);

export const CONTENTS_IMAGES = IMG['p02'];
