import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log("Creating admin user...");
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'atalitixadmin@atalitix.com',
    password: 'atalitix1616',
    email_confirm: true
  });

  if (error) {
    console.error("Error creating user:", error.message);
  } else {
    console.log("Admin user created successfully!");
    console.log("Email:", data.user.email);
  }
}

createAdminUser();
