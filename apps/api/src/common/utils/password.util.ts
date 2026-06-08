import * as bcrypt from 'bcrypt';

export async function hashValue(value: string) {
  return bcrypt.hash(value, 12);
}

export async function compareValue(value: string, hashedValue: string) {
  return bcrypt.compare(value, hashedValue);
}
