import AboutSection from '@/components/sections/AboutSection';

export const metadata = {
  title: 'About',
  description: 'Who I am — Erza Duraku, Software Engineering student in Prishtina.',
};

/** Concept: static route /about; the section is an async Server Component. */
export default function AboutPage() {
  return <AboutSection headingLevel="h1" showSkills />;
}
