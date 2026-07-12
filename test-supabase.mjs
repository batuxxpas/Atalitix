import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching admin_users with anon key...");
  const result = await supabase.from("admin_users").select("*").eq("email", "atalitixadmin").single();
  console.log("Result:", JSON.stringify(result, null, 2));
}

test();
