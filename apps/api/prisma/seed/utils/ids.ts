import { v5 as uuidv5 } from "uuid";

const SEED_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export function deterministicId(name: string): string {
  return uuidv5(name, SEED_NAMESPACE);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
