import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { isAdmin, response: authResponse } = await checkAdmin();
    if (!isAdmin) return authResponse!;

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Check if bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('products');
    if (bucketError || !bucketData) {
      console.error('Bucket check failed:', bucketError);
      return NextResponse.json({ 
        message: 'Storage bucket "products" not found. Please create it in Supabase dashboard.',
        error: bucketError?.message
      }, { status: 404 });
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase Upload Error Detailed:', {
        message: error.message,
        name: error.name,
        stack: (error as any).stack
      });
      return NextResponse.json({ 
        message: `Error uploading to storage: ${error.message}.`,
        error: error.message
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Admin Upload Proxy Error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
