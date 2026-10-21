import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  overviewTitle: { type: String, default: 'Engineering the connections.' },
  detailedDescription: { type: String },
  challenge: { 
    type: String, 
    default: 'Coordinate multiple service installations while maintaining accessible, adaptable and reliable support structures.' 
  },
  approach: { 
    type: String, 
    default: 'Combine modular strut channels, pipe supports and compatible fixing systems to develop an integrated solution around the project specification.' 
  },
  status: { type: String, default: 'Illustrative application' },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Project: mongoose.Model<any> = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;
