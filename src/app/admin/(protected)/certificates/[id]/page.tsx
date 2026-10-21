"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CertificateForm } from '@/components/admin/CertificateForm';
import { ArrowLeft, Award } from 'lucide-react';

export default function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificates/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-[#143e26]/20 border-t-[#143e26] animate-spin" />
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600 mb-4">Certificate not found.</p>
        <Link
          href="/admin/certificates"
          className="text-xs text-[#143e26] font-semibold underline"
        >
          Back to Certificates
        </Link>
      </div>
    );
  }

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
            Edit Certificate: {data.name}
          </h1>
          <p className="text-xs text-gray-500">
            Update issuing credentials or re-upload certificate image
          </p>
        </div>
      </div>

      <CertificateForm initialData={data} />
    </div>
  );
}
