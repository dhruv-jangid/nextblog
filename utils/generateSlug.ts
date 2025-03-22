import crypto from "crypto";

// Allowed characters: a-z, 0-9, . and _
// Convert the name to lowercase and replace any character not allowed with an underscore.
const sanitize = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9._]+/g, "_")
    .replace(/^_+|_+$/g, ""); // also trim any leading/trailing underscores

// Generate a short hash from idSub using SHA-256.
// Using hex gives us only 0-9 and a-f which fits our allowed characters.
const generateHash = (input: string, length: number): string => {
  const fullHash = crypto.createHash("sha256").update(input).digest("hex");
  return fullHash.slice(0, length);
};

export const generateSlug = (name: string, idSub: string): string => {
  // Sanitize the provided name.
  let base = sanitize(name);
  // We'll use 8 characters from the hash (you can adjust this if needed).
  const hashPart = generateHash(idSub.toString(), 8);

  // If there's a sanitized name, join it with the hash using an underscore.
  // Otherwise, use just the hash.
  let slug = base ? `${base}_${hashPart}` : hashPart;

  // Enforce maximum length (20 characters)
  if (slug.length > 20) {
    // Reserve room for the underscore and the hash part.
    const allowedBaseLength = 20 - (hashPart.length + (base ? 1 : 0));
    base = base.slice(0, allowedBaseLength);
    slug = base ? `${base}_${hashPart}` : hashPart;
  }

  // Enforce minimum length (3 characters) by padding with "x"
  if (slug.length < 3) {
    slug = slug.padEnd(3, "x");
  }

  // Ensure the slug starts with a lowercase letter.
  // If not, prefix with "a" and adjust length if necessary.
  if (!/^[a-z]/.test(slug)) {
    slug = "a" + slug;
    if (slug.length > 20) {
      slug = slug.slice(0, 20);
    }
  }

  return slug;
};
