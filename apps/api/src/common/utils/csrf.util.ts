import { createHash, randomBytes } from 'crypto';

export function createCsrfToken(seed?: string) {
  return createHash('sha256').update(`${seed ?? 'csrf'}:${randomBytes(32).toString('hex')}`).digest('hex');
}
