import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload (e.g. base64 data URI)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const image = body.image || body.file;

      if (!image) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'uniclamp',
        resource_type: 'auto',
      });

      return NextResponse.json({
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      });
    }

    // Handle multipart/form-data (FormData)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uniclamp',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
