import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: existing, error: fetchErr } = await supabase
    .from('yaklasim_adimlari')
    .select('*')
    .order('sort_order', { ascending: false });

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    process.exit(1);
  }

  const maxSortOrder = existing && existing.length > 0 ? existing[0].sort_order : 0;

  const newStep = {
    step_number: 5,
    title: 'Danışmanlık & Eğitim',
    description: 'Sistemin benimsenmesi ve süreçlerin sürekli iyileştirilmesi için ekiplerinize özel eğitimler ve danışmanlık sağlarız.',
    sort_order: maxSortOrder + 1,
    is_active: true
  };

  const { data, error } = await supabase
    .from('yaklasim_adimlari')
    .insert([newStep])
    .select();

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Inserted successfully:', data);
  }
}

run();
