import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "ISO 9001:2015"
    title: { type: String, required: true }, // e.g. "Quality Management System"
    issuingBody: { type: String, default: '' }, // e.g. "TÜV / Bureau Veritas / BSI"
    certificateNumber: { type: String, default: '' },
    imageUrl: { type: String, default: '' }, // Cloudinary URL of certificate image/document
    pdfUrl: { type: String, default: '' }, // Optional Cloudinary PDF URL
    issueDate: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certificate: mongoose.Model<any> =
  mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

export default Certificate;
