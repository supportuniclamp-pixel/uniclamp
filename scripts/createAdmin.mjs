import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

try {
  process.loadEnvFile?.();
} catch {}

const MONGODB_URI = process.env.MONGO_URL || "mongodb+srv://samypise5_db_user:HnODTYsXyqsVPtl1@cluster0.osnglp4.mongodb.net/uniclamp";

async function createAdmin() {
  if (!MONGODB_URI) {
    console.error("Please configure MONGO_URL in your .env or this script.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const email = process.env.ADMIN_EMAIL || "admin@uniclamp.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await Admin.create({
    email,
    password: hashedPassword
  });

  console.log(`Admin created successfully!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

createAdmin();
