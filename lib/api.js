/**
 * Concept: data layer. Reads data/db.json directly (bundled at build time), so the pages stay
 * static and nothing waits on json-server at localhost:3001 during a Vercel build (Finance §43:
 * json-server was only a temporary data source). `npm run json-server` still serves the same
 * file for practice, but the app no longer calls it.
 */
import { cache } from 'react';
import localDb from '@/data/db.json';
import { localize } from '@/lib/localize';

// Every getter takes the locale; English is the stored copy, Albanian overrides come from db.sq.json.
async function fetchLocalized(section, locale) {
  return localize(section, localDb[section], locale);
}

export async function getProfile(locale = 'en') {
  return fetchLocalized('profile', locale);
}

// cache() (course lecture 74): memoizes per request, so generateMetadata and the page
// share one result instead of reading/localizing the projects twice.
export const getAllProjects = cache(async (locale = 'en') => {
  return fetchLocalized('projects', locale);
});

/**
 * Only projects with published: true.
 * Set published: true on a project in data/db.json to bring it back on the site.
 */
export async function getProjects(locale = 'en') {
  const projects = await getAllProjects(locale);
  return projects.filter((p) => p.published === true);
}

// Also memoized: called by both generateMetadata and ProjectDetailPage for the same slug.
export const getProjectBySlug = cache(async (slug, locale = 'en') => {
  const projects = await getAllProjects(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.published !== true) {
    return null;
  }
  return project;
});

export async function getExperience(locale = 'en') {
  return fetchLocalized('experience', locale);
}

export async function getVolunteering(locale = 'en') {
  return fetchLocalized('volunteering', locale);
}

export async function getVolunteeringQuote(locale = 'en') {
  return fetchLocalized('volunteeringQuote', locale);
}

export async function getLearning(locale = 'en') {
  return fetchLocalized('learning', locale);
}

export async function getInterests(locale = 'en') {
  return fetchLocalized('interests', locale);
}

export async function getSkills(locale = 'en') {
  return fetchLocalized('skills', locale);
}

export async function getAbout(locale = 'en') {
  return fetchLocalized('about', locale);
}

export async function getContact(locale = 'en') {
  return fetchLocalized('contact', locale);
}

export async function getPurpose(locale = 'en') {
  return fetchLocalized('purpose', locale);
}

export async function getJourney(locale = 'en') {
  const [experience, volunteering, volunteeringQuote, learning] =
    await Promise.all([
      getExperience(locale),
      getVolunteering(locale),
      getVolunteeringQuote(locale),
      getLearning(locale),
    ]);
  return { experience, volunteering, volunteeringQuote, learning };
}
