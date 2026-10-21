"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink, Award, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete certificate "${name}"?`)) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCertificates();
      } else {
        alert('Failed to delete certificate');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting certificate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Award className="text-[#143e26]" size={28} />
            Certifications & Standards
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload official company certificates, audit credentials and standards previews (stored on Cloudinary)
          </p>
        </div>
        <Link href="/admin/certificates/new">
          <Button className="bg-[#143e26] hover:bg-[#1b5534] text-white flex items-center gap-2 shadow-xs">
            <Plus size={16} /> Upload Certificate
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="p-4">Certificate</th>
                <th className="p-4">Issuing Body</th>
                <th className="p-4">Certificate #</th>
                <th className="p-4">Scan / Cloudinary Image</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex justify-center items-center py-6">
                      <div className="w-8 h-8 rounded-full border-2 border-[#143e26]/20 border-t-[#143e26] animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#143e26] mx-auto flex items-center justify-center">
                        <Award size={24} />
                      </div>
                      <p className="font-semibold text-gray-900">No company certificates uploaded yet</p>
                      <p className="text-xs text-gray-500">
                        Upload your ISO, CE, or QA certificates to display official credentials on the public Certifications page.
                      </p>
                      <div className="pt-2">
                        <Link href="/admin/certificates/new">
                          <Button size="sm" className="bg-[#143e26] hover:bg-[#1b5534] text-white">
                            <Plus size={14} className="mr-1.5" /> Upload First Certificate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{cert.name}</div>
                      <div className="text-xs text-gray-500">{cert.title}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {cert.issuingBody || <span className="text-gray-400 italic">Unspecified</span>}
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-xs">
                      {cert.certificateNumber || <span className="text-gray-400 italic font-sans">—</span>}
                    </td>
                    <td className="p-4">
                      {cert.imageUrl ? (
                        <a
                          href={cert.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 group"
                        >
                          <img
                            src={cert.imageUrl}
                            alt={cert.name}
                            className="h-10 w-14 object-cover rounded border border-gray-200 group-hover:opacity-80 transition-opacity"
                          />
                          <span className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium">
                            Cloudinary <ExternalLink size={11} />
                          </span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No image file</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cert.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {cert.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {cert.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/admin/certificates/${cert._id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-gray-600 hover:text-gray-900"
                            title="Edit Certificate"
                          >
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cert._id, cert.name)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Certificate"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
