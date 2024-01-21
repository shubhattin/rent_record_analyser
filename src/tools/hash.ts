import { createHash } from 'node:crypto';

/**
 * Cryptographic Hash for `SHA3-256`
 */
export function hash_sha256(content: string) {
  return createHash('sha3-256').update(content).digest('hex');
}
/**
 * Cryptographic Hash for `SHA3-512`
 */
export function hash_sha512(content: string) {
  return createHash('sha3-512').update(content).digest('hex');
}
/**
 * Verifier for `SHA3-256` hash with salt appended at the end
 */
export const puShTi = (val: string, hash_salt: string) => {
  const hash = hash_salt.substring(0, 64);
  const salt = hash_salt.substring(64);
  return hash_sha256(val + salt) === hash;
};
