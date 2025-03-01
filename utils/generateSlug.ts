export const generateSlug = (name: string): string => {
  let slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9_. ]/g, "")
    .replace(/ /g, "_")
    .replace(/([_\.])\1+/g, "$1")
    .slice(0, 30);

  const randomSuffix = Math.random().toString(36).substring(2, 8);

  slug = `${slug}_${randomSuffix}`;

  if (!/^[a-z]/.test(slug)) {
    slug = `x${slug}`;
  }

  return slug.slice(0, 40);
};
