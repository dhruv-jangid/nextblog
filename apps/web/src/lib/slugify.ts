import slugify from "slugify";

export const slugifyUsername = (text: string) => {
  return slugify(text, {
    lower: true,
    trim: true,
    strict: true,
    remove: /[^a-zA-Z0-9._]/g,
  });
};
