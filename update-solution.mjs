import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
  const { data, error } = await supabase
    .from('cozumler')
    .select('*')
    .eq('title', 'Danışmanlık & Eğitim');

  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }

  if (data && data.length > 0) {
    const { error: updateErr } = await supabase
      .from('cozumler')
      .update({ description: 'ERP, AI, otomasyon, veri ve dijital süreç projelerinde strateji, kapsam, proje yönetimi, uygulama ve ihtiyaca yönelik eğitim desteği sunarız.' })
      .eq('id', data[0].id);

    if (updateErr) {
      console.error('Update error:', updateErr);
    } else {
      console.log('Updated successfully');
    }
  } else {
    console.log('Could not find a row with title "Danışmanlık".');
  }
}

run();
