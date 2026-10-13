import { Code2, Scissors } from 'lucide-react';
import { getAbout, getSkills } from '@/lib/api';
import SectionLabel from '@/components/SectionLabel';

export const metadata = {
  title: 'About',
  description: 'Who I am — Erza Duraku, Software Engineering student in Prishtina.',
};

/**
 * Concept: static route /about as a Server Component with async data fetching.
 */
export default async function AboutPage() {
  const [about, skills] = await Promise.all([getAbout(), getSkills()]);

  return (
    <div className="container-page space-y-16 py-16 sm:py-24">
      <section>
        <SectionLabel number="01">About me</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h1 className="section-title">{about.heading}</h1>
            <div className="mt-8 grid grid-cols-2 border border-border">
              <div className="border-r border-border p-4">
                <Code2 className="mb-3 h-5 w-5 text-primary" aria-hidden />
                <p className="text-sm font-medium">{about.logicCard}</p>
              </div>
              <div className="p-4">
                <Scissors className="mb-3 h-5 w-5 text-accent" aria-hidden />
                <p className="text-sm font-medium">{about.craftCard}</p>
              </div>
            </div>
          </div>
          <div className="space-y-5 lg:col-span-7">
            <p className="text-lg leading-relaxed">{about.lead}</p>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <blockquote className="border-l-2 border-primary pl-5 text-lg leading-relaxed">
              {about.quote}
            </blockquote>
          </div>
        </div>
      </section>

      <section>
        <p className="mb-4 flex items-center gap-2 text-sm font-medium">
          <span className="text-primary">{'{ }'}</span> Tools I use to build
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {skills.map((group, i) => (
            <li
              key={group.id}
              className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 sm:grid-cols-[2.5rem_12rem_1fr]"
            >
              <span className="mono-caps text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium">{group.category}</span>
              <span className="col-span-2 text-sm text-muted-foreground sm:col-span-1">
                {group.items.join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}