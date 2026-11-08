/**
 * Signed admin session tokens (HMAC-SHA256 via Web Crypto).
 * Works in both the Node runtime and the proxy/middleware runtime.
 * Token format: base64url(payload) "." base64url(signature)
 */

export const ADMIN_COOKIE = "admin_token";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array<ArrayBuffer> {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Admin oturum anahtarı tanımlı değil (SUPABASE_SERVICE_ROLE_KEY).");
  return crypto.subtle.importKey(
    "raw",
    enc.encode(`atx-admin-session:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(uid: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = toB64url(enc.encode(JSON.stringify({ uid, exp })));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await getKey(), enc.encode(payload)));
  return `${payload}.${toB64url(sig)}`;
}

/** Returns the admin user id when the token is authentic and unexpired, otherwise null. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await getKey(), fromB64url(sig), enc.encode(payload));
    if (!ok) return null;
    const { uid, exp } = JSON.parse(dec.decode(fromB64url(payload)));
    if (typeof uid !== "string" || typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return uid;
  } catch {
    return null;
  }
}
