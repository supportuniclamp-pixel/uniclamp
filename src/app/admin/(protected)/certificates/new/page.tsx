import { CertificateForm } from '@/components/admin/CertificateForm';
import Link from 'next/link';
import { ArrowLeft, Award } from 'lucide-react';

export default function NewCertificatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/certificates"
          className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Award className="text-[#143e26]" size={24} />
            Upload Certificate
          </h1>
          <p className="text-xs text-gray-500">
            Add standard details and upload certificate scan to Cloudinary
          </p>
        </div>
      </div>

      <CertificateForm />
    </div>
  );
}
