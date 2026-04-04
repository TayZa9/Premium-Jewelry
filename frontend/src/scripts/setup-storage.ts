import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
// Note: Management operations like bucket creation may require the Service Role Key
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey) as string; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupStorage() {
  console.log('--- Supabase Storage Setup ---');
  
  // 1. Ensure 'products' bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const productsBucket = buckets?.find(b => b.name === 'products');

  if (!productsBucket) {
    console.log('Creating "products" bucket...');
    const { error: createError } = await supabase.storage.createBucket('products', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError.message);
      console.log('ACTION REQUIRED: Please create a bucket named "products" manually in the Supabase Dashboard and set it to PUBLIC.');
    } else {
      console.log('Bucket "products" created successfully.');
    }
  } else {
    console.log('Bucket "products" already exists.');
    
    // Ensure it is public
    if (!productsBucket.public) {
      console.log('Updating bucket to public...');
      const { error: updateError } = await supabase.storage.updateBucket('products', {
        public: true
      });
      if (updateError) console.error('Error updating bucket:', updateError.message);
      else console.log('Bucket set to public.');
    }
  }

  console.log('\n--- Setup Complete ---');
}

setupStorage().catch(console.error);
