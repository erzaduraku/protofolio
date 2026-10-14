/**
 * Applies the Albanian overrides from data/db.sq.json on top of the English
 * content. Keyed collections (projects by slug; volunteering, learning,
 * interests and skills by id) are matched by key; arrays of objects merge
 * item by item (so a screenshot only needs its alt); arrays of strings and
 * plain values are replaced. Anything without an override stays in English.
 */
import sqDb from '@/data/db.sq.json';

const KEYS = { projects: 'slug', volunteering: 'id', learning: 'id', interests: 'id', skills: 'id' };
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function merge(base, override) {
  if (override === undefined) return base;
  if (Array.isArray(base) && Array.isArray(override)) {
    if (!override.some(isObject)) return override;
    return base.map((item, i) => merge(item, override[i]));
  }
  if (isObject(base) && isObject(override)) {
    const out = { ...base };
    for (const [key, value] of Object.entries(override)) out[key] = merge(base[key], value);
    return out;
  }
  return override;
}

export function localize(section, data, locale) {
  if (locale !== 'sq' || data == null) return data;
  const override = sqDb[section];
  if (!override) return data;
  const key = KEYS[section];
  if (key && Array.isArray(data)) return data.map((item) => merge(item, override[item[key]]));
  return merge(data, override);
}
