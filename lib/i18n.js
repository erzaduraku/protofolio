/**
 * UI strings for both languages. English is the default and lives at clean URLs
 * (/about); Albanian lives under /sq (/sq/about). Content from db.json is
 * translated separately in data/db.sq.json (see lib/localize.js).
 */
export const LOCALES = ['en', 'sq'];
export const DEFAULT_LOCALE = 'en';
export const LOCALE_COOKIE = 'lang';

export const isLocale = (value) => LOCALES.includes(value);

/** '/sq/about' -> '/about', '/en' -> '/', '/about' -> '/about'. */
export function stripLocale(pathname = '/') {
  const match = /^\/(en|sq)(?=\/|$)/.exec(pathname);
  const rest = match ? pathname.slice(match[0].length) : pathname;
  return rest || '/';
}

/** Locale-aware href: localePath('sq', '/about') -> '/sq/about'; English stays unprefixed. */
export function localePath(locale, href = '/') {
  if (locale !== 'sq' || !href.startsWith('/')) return href;
  return href === '/' ? '/sq' : `/sq${href}`;
}

const en = {
  meta: {
    title: 'Erza Duraku — Software Engineer in the Making',
    description:
      'Portfolio of Erza Duraku, a Software Engineering student building thoughtful software across full-stack development, AI, databases, and cloud.',
    about: { title: 'About', description: 'Who I am — Erza Duraku, Software Engineering student in Prishtina.' },
    projects: { title: 'Projects', description: 'Selected projects by Erza Duraku, with links to GitHub.' },
    journey: { title: 'Journey', description: 'Experience, community volunteering, and learning timeline.' },
    beyond: { title: 'Beyond Code', description: 'Things that shape how I think — beyond software.' },
    contact: { title: 'Contact', description: "Let's build something thoughtful — get in touch with Erza Duraku." },
    cv: { title: 'CV', description: 'The CV of Erza Duraku: education, training, languages, skills and volunteering.' },
    projectNotFound: 'Project not found',
  },
  common: {
    skip: 'Skip to content',
    loading: 'Loading…',
    newTab: ' (opens in a new tab)',
    viewCertificate: 'View certificate',
  },
  nav: {
    label: 'Main',
    home: 'Home',
    homeAria: 'Erza Duraku, home',
    about: 'About',
    projects: 'Projects',
    journey: 'Journey',
    beyond: 'Beyond code',
    contact: 'Contact',
    cv: 'CV',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchTo: 'Shqip — switch to Albanian',
  },
  hero: {
    line1: ['A tailor’s ', 'eye', ','],
    line2: ['a mechanic’s ', 'patience', ''],
    line3: '— in code.',
    viewWork: 'View my work',
    aboutMe: 'About me',
    piecesLabel: 'Paper pattern pieces laid out on a technical drafting grid: logic meets craft',
  },
  about: {
    kicker: 'About',
    funFact: 'Fun fact',
    tools: ['Tools I use to ', 'build', ''],
  },
  projects: {
    side: 'Selected projects',
    heading: ['Problems explored. Systems built. ', 'Lessons kept.'],
    lead: 'Each project is a record of learning—how I understood a problem, made choices, and turned an idea into working software.',
    more: ['More on ', 'GitHub'],
    teamProject: 'Team project',
    technologies: 'Technologies',
    viewProject: 'View project',
    repoFor: (title) => ` repository for ${title} (opens in a new tab)`,
  },
  project: {
    all: '← All projects',
    backAll: '← Back to all projects',
    viewGithub: 'View on GitHub',
    liveDemo: 'Live demo',
    overview: 'Overview',
    stack: 'Tech stack',
    demo: 'Demo',
    noVideo: 'Your browser can’t play this video.',
    downloadDemo: 'Download the demo',
    features: 'Features',
    how: 'How it works',
    screenshots: 'Screenshots',
    team: 'Team',
    role: 'Role',
    members: 'Team members',
    source: 'Source on GitHub ↗',
  },
  journey: {
    kicker: 'Journey',
    heading: ['Learning ', 'beyond', ' the classroom.'],
    lead: 'University built the foundation. Work, training, and community taught me how software lives in the real world.',
    tools: 'Tools',
    topics: 'Topics',
    outside: 'Outside the code',
    community: 'Community taught me to show up.',
    communityEm: 'show up',
    role: 'Role',
    took: 'What I took from it',
  },
  polaroid: {
    photo: (title, i, n) => `${title}, photo ${i} of ${n}`,
    next: (i, n, caption) => `Next photo, ${i} of ${n}: ${caption}`,
    live: (i, n, caption) => `Photo ${i} of ${n}: ${caption}`,
  },
  beyond: {
    side: 'Beyond code',
    heading: 'There is more to me than code.',
    headingEm: 'more',
  },
  contact: {
    kicker: 'Contact',
    email: 'Email',
    phone: 'Phone',
    basedIn: 'Based in',
  },
  form: {
    name: 'Name',
    namePh: 'Your name',
    email: 'Email',
    emailPh: 'you@example.com',
    message: 'Message',
    messagePh: 'What would you like to build or talk about?',
    sending: 'Sending…',
    send: 'Send message',
    missing: 'Please fill in name, email, and message.',
    badEmail: 'Please enter a valid email address.',
    short: 'Message is a bit short, please write a little more.',
    failed: 'Could not send your message. Please try again or email me directly.',
    sent: 'Message sent',
    thanks: ['Thank you — I got your ', 'note', '.'],
    reply: 'I will get back to you soon. You can also reach me anytime at',
    another: 'Send another message',
  },
  cv: {
    kicker: 'Curriculum vitae',
    download: 'Download CV',
    pdfNote: 'PDF, the same content as this page.',
  },
  footer: {
    line: ['Let’s make something ', 'careful', '.'],
    designed: 'Designed between logic & craft',
    top: 'Back to top',
  },
  notFound: {
    heading: ['Page ', 'not found'],
    body: 'That page doesn’t exist — or the project isn’t published yet.',
    home: 'Back home',
  },
  chat: {
    greeting: "Hi! I can tell you about Erza's projects, internship and volunteering. Ask in English or Albanian.",
    suggestions: ['What projects has she built?', 'What did she do at AnchorzUp?', 'What motivates her?'],
    title: 'Ask about Erza',
    subtitle: 'An AI assistant. Answers use what is on this site.',
    close: 'Close chat',
    closeShort: 'Close',
    you: 'You: ',
    assistant: 'Assistant: ',
    thinking: 'Thinking…',
    suggested: 'Suggested questions',
    question: 'Your question',
    placeholder: 'Ask a question…',
    send: 'Send',
    genericError: 'Something went wrong. Please try again.',
    empty: 'No answer came back. Please try again.',
    rateWait: (s) => `Lots of questions right now. Retrying in ${s}s…`,
    rateFinal: 'Please try again in a minute.',
    retry: 'Try again',
  },
};

const sq = {
  meta: {
    title: 'Erza Duraku — Inxhiniere softueri në formim',
    description:
      'Portofoli i Erza Durakut, studente e Inxhinierisë Softuerike që ndërton softuer me kujdes në zhvillimin full-stack, AI, bazat e të dhënave dhe cloud.',
    about: { title: 'Rreth meje', description: 'Kush jam — Erza Duraku, studente e Inxhinierisë Softuerike në Prishtinë.' },
    projects: { title: 'Projektet', description: 'Projekte të përzgjedhura të Erza Durakut, me lidhje në GitHub.' },
    journey: { title: 'Rrugëtimi', description: 'Përvoja, vullnetarizmi në komunitet dhe rrugëtimi i të mësuarit.' },
    beyond: { title: 'Përtej kodit', description: 'Gjërat që formësojnë mënyrën si mendoj — përtej softuerit.' },
    contact: { title: 'Kontakt', description: 'Le të ndërtojmë diçka me kujdes — kontaktoni Erza Durakun.' },
    cv: { title: 'CV', description: 'CV-ja e Erza Durakut: arsimi, trajnimet, gjuhët, aftësitë dhe vullnetarizmi.' },
    projectNotFound: 'Projekti nuk u gjet',
  },
  common: {
    skip: 'Kalo te përmbajtja',
    loading: 'Duke u ngarkuar…',
    newTab: ' (hapet në skedë të re)',
    viewCertificate: 'Shiko certifikatën',
  },
  nav: {
    label: 'Kryesore',
    home: 'Ballina',
    homeAria: 'Erza Duraku, ballina',
    about: 'Rreth meje',
    projects: 'Projektet',
    journey: 'Rrugëtimi',
    beyond: 'Përtej kodit',
    contact: 'Kontakt',
    cv: 'CV',
    openMenu: 'Hap menynë',
    closeMenu: 'Mbyll menynë',
    language: 'Gjuha',
    switchTo: 'English — kalo në anglisht',
  },
  hero: {
    line1: ['', 'Syri', ' i rrobaqepëses,'],
    line2: ['', 'durimi', ' i mekanikut'],
    line3: '— në kod.',
    viewWork: 'Shiko punën time',
    aboutMe: 'Rreth meje',
    piecesLabel: 'Copa modelesh prej letre të shtrira mbi një rrjetë vizatimi teknik: logjika takon zanatin',
  },
  about: {
    kicker: 'Rreth meje',
    funFact: 'Fakt argëtues',
    tools: ['Mjetet me të cilat ', 'ndërtoj', ''],
  },
  projects: {
    side: 'Projekte të përzgjedhura',
    heading: ['Probleme të eksploruara. Sisteme të ndërtuara. ', 'Mësime të ruajtura.'],
    lead: 'Çdo projekt është një dëshmi e të mësuarit: si e kuptova një problem, si bëra zgjedhje dhe si e ktheva një ide në softuer që funksionon.',
    more: ['Më shumë në ', 'GitHub'],
    teamProject: 'Projekt ekipor',
    technologies: 'Teknologjitë',
    viewProject: 'Shiko projektin',
    repoFor: (title) => ` repozitori i ${title} (hapet në skedë të re)`,
  },
  project: {
    all: '← Të gjitha projektet',
    backAll: '← Kthehu te të gjitha projektet',
    viewGithub: 'Shiko në GitHub',
    liveDemo: 'Demo live',
    overview: 'Përmbledhje',
    stack: 'Teknologjitë',
    demo: 'Demo',
    noVideo: 'Shfletuesi juaj nuk mund ta luajë këtë video.',
    downloadDemo: 'Shkarkoni demon',
    features: 'Veçoritë',
    how: 'Si funksionon',
    screenshots: 'Pamje nga ekrani',
    team: 'Ekipi',
    role: 'Roli',
    members: 'Anëtarët e ekipit',
    source: 'Kodi burimor në GitHub ↗',
  },
  journey: {
    kicker: 'Rrugëtimi',
    heading: ['Të mësuarit ', 'përtej', ' auditorit.'],
    lead: 'Universiteti ndërtoi themelet. Puna, trajnimet dhe komuniteti më mësuan si jeton softueri në botën reale.',
    tools: 'Mjetet',
    topics: 'Temat',
    outside: 'Jashtë kodit',
    community: 'Komuniteti më mësoi të jem e pranishme.',
    communityEm: 'e pranishme',
    role: 'Roli',
    took: 'Çfarë mora me vete',
  },
  polaroid: {
    photo: (title, i, n) => `${title}, fotoja ${i} nga ${n}`,
    next: (i, n, caption) => `Fotoja tjetër, ${i} nga ${n}: ${caption}`,
    live: (i, n, caption) => `Fotoja ${i} nga ${n}: ${caption}`,
  },
  beyond: {
    side: 'Përtej kodit',
    heading: 'Tek unë ka më shumë se kod.',
    headingEm: 'më shumë',
  },
  contact: {
    kicker: 'Kontakt',
    email: 'Email',
    phone: 'Telefoni',
    basedIn: 'Vendndodhja',
  },
  form: {
    name: 'Emri',
    namePh: 'Emri juaj',
    email: 'Email',
    emailPh: 'ju@shembull.com',
    message: 'Mesazhi',
    messagePh: 'Çfarë do të donit të ndërtojmë ose të bisedojmë?',
    sending: 'Po dërgohet…',
    send: 'Dërgo mesazhin',
    missing: 'Ju lutem plotësoni emrin, email-in dhe mesazhin.',
    badEmail: 'Ju lutem shkruani një adresë email-i të vlefshme.',
    short: 'Mesazhi është pak i shkurtër. Ju lutem shkruani edhe pak.',
    failed: 'Mesazhi nuk u dërgua. Provoni përsëri ose më shkruani drejtpërdrejt me email.',
    sent: 'Mesazhi u dërgua',
    thanks: ['Faleminderit — e mora ', 'mesazhin', ' tuaj.'],
    reply: 'Do t’ju përgjigjem së shpejti. Mund të më shkruani edhe në çdo kohë në',
    another: 'Dërgo një mesazh tjetër',
  },
  cv: {
    kicker: 'Curriculum vitae',
    download: 'Shkarko CV-në',
    pdfNote: 'PDF, me të njëjtën përmbajtje si kjo faqe.',
  },
  footer: {
    line: ['Le të krijojmë diçka me ', 'kujdes', '.'],
    designed: 'Dizajnuar mes logjikës & zanatit',
    top: 'Kthehu lart',
  },
  notFound: {
    heading: ['Faqja ', 'nuk u gjet'],
    body: 'Kjo faqe nuk ekziston — ose projekti nuk është publikuar ende.',
    home: 'Kthehu në ballinë',
  },
  chat: {
    greeting: 'Përshëndetje! Mund t’ju tregoj për projektet, praktikën dhe vullnetarizmin e Erzës. Pyetni në shqip ose në anglisht.',
    suggestions: ['Çfarë projektesh ka ndërtuar?', 'Çfarë ka bërë në AnchorzUp?', 'Çfarë e motivon?'],
    title: 'Pyet për Erzën',
    subtitle: 'Asistent me AI. Përgjigjet bazohen në përmbajtjen e kësaj faqeje.',
    close: 'Mbyll bisedën',
    closeShort: 'Mbyll',
    you: 'Ju: ',
    assistant: 'Asistenti: ',
    thinking: 'Po mendon…',
    suggested: 'Pyetje të sugjeruara',
    question: 'Pyetja juaj',
    placeholder: 'Bëni një pyetje…',
    send: 'Dërgo',
    genericError: 'Diçka shkoi keq. Ju lutem provoni përsëri.',
    empty: 'Nuk erdhi asnjë përgjigje. Ju lutem provoni përsëri.',
    rateWait: (s) => `Shumë pyetje për momentin. Po provoj përsëri pas ${s}s…`,
    rateFinal: 'Provo përsëri pas një minute.',
    retry: 'Provo përsëri',
  },
};

const DICTS = { en, sq };

export function getDict(locale) {
  return DICTS[locale] || en;
}
