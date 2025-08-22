import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const CV_FILENAME = 'Ramon_Zambrano_developer.pdf';
const BUCKET_NAME = 'CV_storage';
const CONTENT_TYPE = 'application/pdf';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validación más robusta de variables de entorno
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json(
      { error: 'Server configuration error. Please contact support.' }, 
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // Verificar si el archivo existe antes de descargarlo
    const { data: fileInfo, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { search: CV_FILENAME });

    if (listError) {
      console.error('Error checking file existence:', listError);
      return NextResponse.json(
        { error: 'Failed to access CV storage.' }, 
        { status: 500 }
      );
    }

    if (!fileInfo || fileInfo.length === 0) {
      console.error('CV file not found in storage');
      return NextResponse.json(
        { error: 'CV file not found.' }, 
        { status: 404 }
      );
    }

    // Descargar el archivo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(CV_FILENAME);

    if (error) {
      console.error('Error downloading file from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to download CV.' }, 
        { status: 500 }
      );
    }

    if (!data || data.size === 0) {
      console.error('Downloaded file is empty');
      return NextResponse.json(
        { error: 'CV file is empty or corrupted.' }, 
        { status: 500 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', CONTENT_TYPE);
    headers.set('Content-Disposition', `attachment; filename="${CV_FILENAME}"`);
    headers.set('Content-Length', data.size.toString());
    headers.set('Cache-Control', 'public, max-age=3600');

    return new Response(data, { headers });

  } catch (error) {
    console.error('Unexpected error in download-cv API:', error);
    
    // Log más detallado del error para debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error.' }, 
      { status: 500 }
    );
  }
}