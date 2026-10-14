/**
 * Concept: data layer. Server Components fetch with revalidate: 60 and fall back
 * to data/db.json when json-server is offline or slow (e.g. during build).
 */
import localDb from '@/data/db.json';

const API_URL = process.env.API_URL || 'http://localhost:3001';

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

export async function getProfile() {
  return fetchFromApi('/profile', localDb.profile);
}

export async function getAllProjects() {
  return fetchFromApi('/projects', localDb.projects);
}

/**
 * Only projects with published: true.
 * Set published: true on a project in data/db.json to bring it back on the site.
 */
export async function getProjects() {
  const projects = await getAllProjects();
  return projects.filter((p) => p.published === true);
}

export async function getProjectBySlug(slug) {
  const projects = await getAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project || project.published !== true) {
    return null;
  }
  return project;
}

export async function getFeaturedProjects() {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getExperience() {
  return fetchFromApi('/experience', localDb.experience);
}

export async function getVolunteering() {
  return fetchFromApi('/volunteering', localDb.volunteering);
}

export async function getVolunteeringQuote() {
  return fetchFromApi('/volunteeringQuote', localDb.volunteeringQuote);
}

export async function getLearning() {
  return fetchFromApi('/learning', localDb.learning);
}

export async function getInterests() {
  return fetchFromApi('/interests', localDb.interests);
}


export async function getSkills() {
  return fetchFromApi('/skills', localDb.skills);
}

export async function getAbout() {
  return fetchFromApi('/about', localDb.about);
}

export async function getContact() {
  return fetchFromApi('/contact', localDb.contact);
}

export async function getPurpose() {
  return fetchFromApi('/purpose', localDb.purpose);
}

export async function getJourney() {
  const [experience, volunteering, volunteeringQuote, learning] =
    await Promise.all([
      getExperience(),
      getVolunteering(),
      getVolunteeringQuote(),
      getLearning(),
      ]);
  return { experience, volunteering, volunteeringQuote, learning };
}