import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const certificate = await Certificate.findById(id).lean();

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const updated = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const deleted = await Certificate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Certificate deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}
