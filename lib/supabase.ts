import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for operations that need elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const uploadFile = async (file: File) => {
  const { data, error } = await supabaseAdmin.storage
    .from('afisalesimages')
    .upload(file.name, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return data;
}

