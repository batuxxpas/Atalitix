import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to alter table, or maybe we can't alter via API.

console.log("Supabase URL:", supabaseUrl);
