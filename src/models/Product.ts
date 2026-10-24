import mongoose from 'mongoose';

const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  shortDescription: { type: String },
  description: { type: String },
  specifications: [SpecificationSchema],
  specificationImage: { type: String },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// If model was previously compiled without specificationImage, replace or update schema
if (mongoose.models.Product && !mongoose.models.Product.schema.path('specificationImage')) {
  mongoose.models.Product.schema.add({ specificationImage: { type: String } });
}

const Product: mongoose.Model<any> = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
