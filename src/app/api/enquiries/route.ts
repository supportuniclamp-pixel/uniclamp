import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { sendEnquiryEmail } from '@/lib/mailer';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(enquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, subject, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    await dbConnect();
    const enquiry = await Enquiry.create(body);

    // Send email notification via SMTP
    try {
      await sendEnquiryEmail({
        fullName,
        email,
        company: body.company,
        phone: body.phone,
        subject,
        product: body.product,
        message,
      });
    } catch (mailError) {
      console.error('Failed to send enquiry email notification:', mailError);
      // Still succeed so user sees submission confirmation even if SMTP throws
    }

    return NextResponse.json(
      { success: true, message: 'Your enquiry has been received successfully!', enquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Enquiry creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}
