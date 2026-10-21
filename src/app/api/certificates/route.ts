import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';

export async function GET() {
  try {
    await dbConnect();
    const certificates = await Certificate.find({})
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();

    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: 'Certificate name and title are required' },
        { status: 400 }
      );
    }

    const certificate = await Certificate.create(body);
    return NextResponse.json(certificate, { status: 201 });
  } catch (error: any) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
