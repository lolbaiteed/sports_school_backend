import bcrypt from "bcrypt";
import crypro from "crypto";

const SALT_ROUNDS= 12;
const ALGORITHM="aes-256-cbc";
const SECRET_KEY="5c2cd78ea3fe80275c98a169062a57a5810667724c86940576347791b207dd3b";

export async function hashData(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function encrypt(data: string) {
  const iv = crypro.randomBytes(16);
  const cipher = crypro.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ":" + encrypted.toString('hex');
}

export function decrypt(data: string | null): string | null {
  if (!data) return null; // handle empty or null

  try {
    const parts = data.split(":");
    if (parts.length !== 2) throw new Error("Invalid encrypted data format");

    const [ivHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypro.createDecipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY, "hex"),
      iv
    );

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");

  } catch (err) {
    console.error("Failed to decrypt phone number:", err, "Data:", data);
    return null; // fallback to null instead of crashing
  }
}
  
