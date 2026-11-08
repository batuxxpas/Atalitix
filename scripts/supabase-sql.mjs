/**
 * Runs a .sql file against the Supabase project via the Management API.
 * Usage: node --env-file=.env.local scripts/supabase-sql.mjs path/to/file.sql
 * Needs SUPABASE_ACCESS_TOKEN (supabase.com/dashboard/account/tokens) in .env.local.
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
const token = process.env.SUPABASE_ACCESS_TOKEN;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!file || !token || !url) {
  console.error("Kullanım: node --env-file=.env.local scripts/supabase-sql.mjs <dosya.sql>  (SUPABASE_ACCESS_TOKEN gerekli)");
  process.exit(1);
}
const ref = new URL(url).hostname.split(".")[0];
const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: readFileSync(file, "utf8") }),
});
const body = await res.text();
if (!res.ok) {
  console.error(`HATA ${res.status}: ${body}`);
  process.exit(1);
}
try {
  const rows = JSON.parse(body);
  if (Array.isArray(rows) && rows.length) console.table(rows);
  else console.log("Tamam.");
} catch {
  console.log(body);
}
