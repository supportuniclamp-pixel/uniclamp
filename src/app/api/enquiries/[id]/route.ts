import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    await dbConnect();
    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}
