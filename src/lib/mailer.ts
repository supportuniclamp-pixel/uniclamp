import nodemailer from 'nodemailer';

interface SendEnquiryEmailParams {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  product?: string;
  message: string;
}

export async function sendEnquiryEmail(data: SendEnquiryEmailParams) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  // Gmail app passwords can contain spaces, normalize by removing spaces
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';
  const receiver = process.env.SMTP_RECEIVER_EMAIL || user;

  if (!user || !pass) {
    console.warn('SMTP credentials (SMTP_USER or SMTP_PASS) are not configured. Skipping email delivery.');
    return { skipped: true, reason: 'SMTP credentials missing' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #1f2937;">
      <div style="background-color: #0d3824; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">New Website Enquiry</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">UNIclamp — Pipe Supports & Fixing Systems</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563; width: 140px;">Full Name:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600;">${data.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563;">Email Address:</td>
              <td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #0d3824; text-decoration: none;">${data.email}</a></td>
            </tr>
            ${data.phone ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563;">Phone Number:</td>
              <td style="padding: 10px 0; color: #111827;">${data.phone}</td>
            </tr>` : ''}
            ${data.company ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563;">Company:</td>
              <td style="padding: 10px 0; color: #111827;">${data.company}</td>
            </tr>` : ''}
            ${data.product ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563;">Product of Interest:</td>
              <td style="padding: 10px 0; color: #111827;">${data.product}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: 600; color: #4b5563;">Subject:</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600;">${data.subject}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 20px;">
          <h4 style="margin: 0 0 8px; font-size: 14px; color: #4b5563; font-weight: 600;">Message Content:</h4>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #374151;">${data.message}</div>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background-color: #0d3824; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 5px; font-size: 13px; font-weight: 600;">
            Reply to ${data.fullName}
          </a>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 14px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        This notification was generated automatically by UNIclamp contact inquiry system.
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"UNIclamp Enquiries" <${user}>`,
    to: receiver,
    replyTo: data.email,
    subject: `[New Enquiry] ${data.subject} - ${data.fullName}`,
    text: `New Enquiry from ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nCompany: ${data.company || 'N/A'}\nProduct: ${data.product || 'N/A'}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}
