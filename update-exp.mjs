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
    .from('ana_sayfa_icerik')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }

  console.log('Current content:', data);

  const updates = {};
  if (data.experience_years === '25' || data.experience_years === '25+') {
    updates.experience_years = '20';
  }
  if (data.cta_secondary_text && data.cta_secondary_text.includes('25')) {
    updates.cta_secondary_text = data.cta_secondary_text.replace('25', '20');
  }

  if (Object.keys(updates).length > 0) {
    console.log('Updating with:', updates);
    const { error: updateErr } = await supabase
      .from('ana_sayfa_icerik')
      .update(updates)
      .eq('id', data.id);
    
    if (updateErr) {
      console.error('Update error:', updateErr);
    } else {
      console.log('Updated successfully');
    }
  } else {
    console.log('No updates needed based on current data.');
    // Just force update experience_years to 20 just in case
    console.log('Forcing update of experience_years to 20');
    await supabase.from('ana_sayfa_icerik').update({ experience_years: '20' }).eq('id', data.id);
  }
}

run();
