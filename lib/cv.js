/**
 * CV content. English is copied verbatim from public/cv/Erza-Duraku-CV.pdf; Albanian is a
 * translation of it (names, institutions and tech terms unchanged). Used by /cv and the chatbot.
 * Update the PDF, en and sq together.
 */
export const CV_PDF = '/cv/Erza-Duraku-CV.pdf';

const en = {
  name: 'Erza Duraku',
  headings: {
    about: 'About me',
    education: 'Education and training',
    languages: 'Language skills',
    skills: 'Skills',
    volunteering: 'Volunteering',
    mother: 'Mother tongue(s):',
    other: 'Other language(s):',
  },
  contact: [
    { label: 'Work', value: 'Prishtina, Kosovo' },
    { label: 'Email', value: 'erzaaduraku15@gmail.com', href: 'mailto:erzaaduraku15@gmail.com' },
    { label: 'Email', value: 'erza.duraku@student.uni-pr.edu', href: 'mailto:erza.duraku@student.uni-pr.edu' },
    { label: 'Phone', value: '(+383) 43 597 172', href: 'tel:+38343597172' },
    { label: 'LinkedIn', value: 'www.linkedin.com/in/erza-duraku-bb6950389', href: 'https://www.linkedin.com/in/erza-duraku-bb6950389', external: true },
    { label: 'GitHub', value: 'https://github.com/erzaduraku', href: 'https://github.com/erzaduraku', external: true },
  ],
  personal: [
    { label: 'ID', value: '1253109218' },
    { label: 'Work permit', value: 'Kosovar' },
    { label: 'Date of birth', value: '15/02/2005' },
    { label: 'Place of birth', value: 'Rahovec' },
    { label: 'Nationality', value: 'Kosovar' },
  ],
  about:
    'Software Engineering student at the University of Prishtina interested in backend and full-stack development, cloud computing, and DevOps. Building practical experience through academic projects and continuously improving my software engineering skills. Seeking internship opportunities to apply technical skills and gain industry experience.',
  education: [
    {
      period: '01/10/2023 – Current',
      title: 'Bachelor of Computer and Software',
      place: 'University of Prishtina',
      location: 'City: Prishtina | Country: Kosovo',
    },
    {
      period: '01/09/2020 – 28/03/2023',
      title: 'High School Diploma',
      place: 'Mehmet Akif College',
      location: 'City: Prizren | Country: Kosovo',
    },
    {
      period: '23/03/2026 – 11/06/2026',
      title: 'Cloud Computing & DevOps Training Program',
      place: 'KREN & World Bank',
      certificate: '/certificates/cloud-computing-devops.pdf',
      location: 'City: Prishtine | Country: Kosovo',
      details: [
        'Training in AWS, Terraform, Docker, GitHub Actions, Linux, and DevOps practices.',
        'Developing practical skills in cloud infrastructure, automation, containerization, and CI/CD.',
      ],
    },
  ],
  languages: {
    mother: 'Albanian',
    other: [
      {
        name: 'English',
        levels: [
          ['Listening', 'B2'],
          ['Reading', 'B2'],
          ['Writing', 'B2'],
          ['Spoken production', 'B2'],
          ['Spoken interaction', 'B2'],
        ],
      },
    ],
    note: 'Levels: A1 and A2: Basic user; B1 and B2: Independent user; C1 and C2: Proficient user',
  },
  skills: [
    {
      group: 'Digital Skills',
      items: [
        'TCP/IP and networking (switching, routing, subnets, DHCP, VLAN)',
        'AWS - Lambda, ECS, EKS, S3, API Gateway, Serverless',
        'Basic knowledge in Terraform for AWS',
        'Linux',
        'Java',
        'CI/CD basics',
        'SQL(MySQL PostgreSQL)',
        'Git (and GitHub)',
        'C, C++,C#',
        'Html / CSS / JavaScript',
        'Microsoft Excel',
        'Microsoft Word',
      ],
    },
    {
      group: 'Self-improvement',
      items: [
        'Continuous learning of software engineering concepts',
        'Improving problem-solving and algorithmic thinking',
        'Practicing clean code and code organization',
        'Learning modern development tools and workflows',
      ],
    },
  ],
  volunteering: [
    {
      period: '25/10/2025 – 26/10/2025',
      title: 'SFK 2025 – 10th Edition',
      place: 'Prishtina',
      text: 'Volunteered at SFK 2025 – 10th Edition organized by FLOSSK. Assisted with event coordination, workshop setup, guiding participants, and supporting speakers.',
    },
    {
      period: '05/12/2025 – 06/12/2025',
      title: 'DevFest Prishtina 2025',
      place: 'Prishtina',
      text: 'Volunteered at DevFest Prishtina 2025 by coordinating speaker time, informing presenters of their schedules, and assisting with technical setup and overall event logistics.',
    },
    {
      period: '21/05/2026 – 23/05/2026',
      title: 'Digi Camp & Digital Skills Festival 2026',
      place: 'ITP Prizren, Kosovo',
      text: 'Volunteered at Digi Camp & Digital Skills Festival 2026. Supported organization and execution of workshops, sessions, and festival activities, collaborated with professionals and mentors, and assisted with operational tasks during a 3-day international-level tech festival',
    },
  ],
};

const sq = {
  name: 'Erza Duraku',
  headings: {
    about: 'Rreth meje',
    education: 'Arsimi dhe trajnimet',
    languages: 'Njohja e gjuhëve',
    skills: 'Aftësitë',
    volunteering: 'Vullnetarizmi',
    mother: 'Gjuha amtare:',
    other: 'Gjuhë të tjera:',
  },
  contact: [
    { label: 'Puna', value: 'Prishtinë, Kosovë' },
    { label: 'Email', value: 'erzaaduraku15@gmail.com', href: 'mailto:erzaaduraku15@gmail.com' },
    { label: 'Email', value: 'erza.duraku@student.uni-pr.edu', href: 'mailto:erza.duraku@student.uni-pr.edu' },
    { label: 'Telefoni', value: '(+383) 43 597 172', href: 'tel:+38343597172' },
    { label: 'LinkedIn', value: 'www.linkedin.com/in/erza-duraku-bb6950389', href: 'https://www.linkedin.com/in/erza-duraku-bb6950389', external: true },
    { label: 'GitHub', value: 'https://github.com/erzaduraku', href: 'https://github.com/erzaduraku', external: true },
  ],
  personal: [
    { label: 'Numri personal', value: '1253109218' },
    { label: 'Leja e punës', value: 'Kosovare' },
    { label: 'Data e lindjes', value: '15/02/2005' },
    { label: 'Vendi i lindjes', value: 'Rahovec' },
    { label: 'Shtetësia', value: 'Kosovare' },
  ],
  about:
    'Studente e Inxhinierisë Softuerike në Universitetin e Prishtinës, e interesuar për zhvillimin backend dhe full-stack, cloud computing dhe DevOps. Po fitoj përvojë praktike përmes projekteve akademike dhe po i përmirësoj vazhdimisht aftësitë e mia në inxhinierinë softuerike. Kërkoj mundësi praktike për të zbatuar aftësitë teknike dhe për të fituar përvojë në industri.',
  education: [
    {
      period: '01/10/2023 – Në vazhdim',
      title: 'Bachelor në Inxhinieri Kompjuterike dhe Softuerike',
      place: 'Universiteti i Prishtinës',
      location: 'Qyteti: Prishtinë | Shteti: Kosovë',
    },
    {
      period: '01/09/2020 – 28/03/2023',
      title: 'Diplomë e shkollës së mesme',
      place: 'Mehmet Akif College',
      location: 'Qyteti: Prizren | Shteti: Kosovë',
    },
    {
      period: '23/03/2026 – 11/06/2026',
      title: 'Programi i trajnimit Cloud Computing & DevOps',
      place: 'KREN & World Bank',
      certificate: '/certificates/cloud-computing-devops.pdf',
      location: 'Qyteti: Prishtinë | Shteti: Kosovë',
      details: [
        'Trajnim në AWS, Terraform, Docker, GitHub Actions, Linux dhe praktikat DevOps.',
        'Zhvillim i aftësive praktike në infrastrukturën cloud, automatizimin, kontejnerizimin dhe CI/CD.',
      ],
    },
  ],
  languages: {
    mother: 'Shqip',
    other: [
      {
        name: 'Anglisht',
        levels: [
          ['Dëgjimi', 'B2'],
          ['Leximi', 'B2'],
          ['Shkrimi', 'B2'],
          ['Të folurit (prodhimi)', 'B2'],
          ['Të folurit (bashkëbisedimi)', 'B2'],
        ],
      },
    ],
    note: 'Nivelet: A1 dhe A2: përdorues bazë; B1 dhe B2: përdorues i pavarur; C1 dhe C2: përdorues i avancuar',
  },
  skills: [
    {
      group: 'Aftësi digjitale',
      items: [
        'TCP/IP dhe rrjetet (switching, routing, subnets, DHCP, VLAN)',
        'AWS - Lambda, ECS, EKS, S3, API Gateway, Serverless',
        'Njohuri bazë në Terraform për AWS',
        'Linux',
        'Java',
        'Bazat e CI/CD',
        'SQL (MySQL, PostgreSQL)',
        'Git (dhe GitHub)',
        'C, C++, C#',
        'HTML / CSS / JavaScript',
        'Microsoft Excel',
        'Microsoft Word',
      ],
    },
    {
      group: 'Vetëzhvillimi',
      items: [
        'Mësim i vazhdueshëm i koncepteve të inxhinierisë softuerike',
        'Përmirësim i zgjidhjes së problemeve dhe i të menduarit algoritmik',
        'Praktikim i kodit të pastër dhe i organizimit të kodit',
        'Mësim i mjeteve dhe i proceseve moderne të zhvillimit',
      ],
    },
  ],
  volunteering: [
    {
      period: '25/10/2025 – 26/10/2025',
      title: 'SFK 2025 – Edicioni i 10-të',
      place: 'Prishtinë',
      text: 'Vullnetare në SFK 2025 – Edicioni i 10-të, i organizuar nga FLOSSK. Ndihmova në koordinimin e eventit, përgatitjen e punëtorive, udhëzimin e pjesëmarrësve dhe mbështetjen e folësve.',
    },
    {
      period: '05/12/2025 – 06/12/2025',
      title: 'DevFest Prishtina 2025',
      place: 'Prishtinë',
      text: 'Vullnetare në DevFest Prishtina 2025: koordinova kohën e folësve, i njoftova prezantuesit për oraret e tyre dhe ndihmova në përgatitjen teknike dhe në logjistikën e përgjithshme të eventit.',
    },
    {
      period: '21/05/2026 – 23/05/2026',
      title: 'Digi Camp & Digital Skills Festival 2026',
      place: 'ITP Prizren, Kosovë',
      text: 'Vullnetare në Digi Camp & Digital Skills Festival 2026. Mbështeta organizimin dhe zhvillimin e punëtorive, sesioneve dhe aktiviteteve të festivalit, bashkëpunova me profesionistë dhe mentorë dhe ndihmova në detyrat operative gjatë një festivali teknologjik treditor të nivelit ndërkombëtar.',
    },
  ],
};

export function getCv(locale = 'en') {
  return locale === 'sq' ? sq : en;
}
