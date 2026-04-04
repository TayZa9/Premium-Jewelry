import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.STRIPE_SECRET_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : ''; // Just need any key to check

async function inspect() {
  const supabase = createClient(supabaseUrl, process.env.DATABASE_URL!.includes('pooler') ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : '');
  
  // Use service role if possible, but let's try anon for now
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  console.log('Available buckets:', buckets.map(b => b.name));
  
  const hasProducts = buckets.some(b => b.name === 'products');
  if (!hasProducts) {
    console.log('Creating products bucket...');
    // Note: Creating bucket via API might need service role key
  }
}

inspect();
