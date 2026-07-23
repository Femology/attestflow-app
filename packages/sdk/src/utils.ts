import { createHash } from 'crypto';

/**
 * Generates a SHA-256 hash of the provided data, formatted as a hex string.
 * @param data string or object to hash
 * @returns 64-character hex string representing the 32-byte hash
 */
export function hashData(data: string | object): string {
  const stringified = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(stringified).digest('hex');
}

/**
 * Formats a unique identifier (UID) for an attestation based on its components.
 * @param issuer Issuer public key
 * @param recipient Recipient public key
 * @param schemaId ID of the schema
 * @param nonce Unique nonce string
 * @returns 64-character hex string representing the 32-byte UID
 */
export function formatUid(issuer: string, recipient: string, schemaId: bigint, nonce: string): string {
  const dataToHash = `${issuer}:${recipient}:${schemaId.toString()}:${nonce}`;
  return hashData(dataToHash);
}
