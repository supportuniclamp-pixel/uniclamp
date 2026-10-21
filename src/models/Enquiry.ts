import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  product: { type: String, default: 'General enquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
}, { timestamps: true });

const Enquiry: mongoose.Model<any> = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export default Enquiry;
