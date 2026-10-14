/**
 * Concept: data layer. Server Components fetch with revalidate: 60 and fall back
 * to data/db.json when json-server is offline or slow (e.g. during build).
 */
import localDb from '@/data/db.json';
import { localize } from '@/lib/localize';

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Every getter takes the locale; English is the stored copy, Albanian overrides come from db.sq.json.
async function fetchLocalized(section, locale) {
  return localize(section, await fetchFromApi(`/${section}`, localDb[section]), locale);
}

async function fetchFromApi(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(800),
    });
    if (!res.ok) {
      throw new Error(`API responded with ${res.status}`);
    }
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getProfile(locale = 'en') {
  return fetchLocalized('profile', locale);
}

export async function getAllProjects(locale = 'en') {
  return fetchLocalized('projects', locale);
}

/**
 * Only projects with published: true.
 * Set published: true on a project in data/db.json to bring it back on the site.
 */
export async function getProjects(locale = 'en') {
  const projects = await getAllProjects(locale);
  return projects.filter((p) => p.published === true);
}

export async function getProjectBySlug(slug, locale = 'en') {
  const projects = await getAllProjects(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.published !== true) {
    return null;
  }
  return project;
}

export async function getFeaturedProjects(locale = 'en') {
  const projects = await getProjects(locale);
  return projects.filter((p) => p.featured);
}

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
