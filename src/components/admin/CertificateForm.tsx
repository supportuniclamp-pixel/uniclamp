"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const COMMON_STANDARDS = [
  { name: 'ISO 9001:2015', title: 'Quality Management System' },
  { name: 'ISO 14001:2015', title: 'Environmental Management System' },
  { name: 'ISO 45001:2018', title: 'Occupational Health & Safety' },
  { name: 'CE Compliance', title: 'European Conformity Certification' },
  { name: 'UL Listed', title: 'Underwriters Laboratories Certification' },
  { name: 'FM Approved', title: 'Factory Mutual Pipe Hanger Approval' },
];

export function CertificateForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    issuingBody: initialData?.issuingBody || '',
    certificateNumber: initialData?.certificateNumber || '',
    imageUrl: initialData?.imageUrl || '',
    pdfUrl: initialData?.pdfUrl || '',
    issueDate: initialData?.issueDate || '',
    expiryDate: initialData?.expiryDate || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
    displayOrder: initialData?.displayOrder || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const applyTemplate = (std: { name: string; title: string }) => {
    setFormData((prev) => ({
      ...prev,
      name: std.name,
      title: std.title,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'pdf'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploadingImage(true);
    else setUploadingPdf(true);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload to Cloudinary failed');
      }

      const result = await res.json();
      if (type === 'image') {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        setFormData((prev) => ({ ...prev, pdfUrl: result.url }));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'File upload failed');
    } finally {
      if (type === 'image') setUploadingImage(false);
      else setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/certificates/${initialData._id}`
        : '/api/certificates';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/certificates');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save certificate');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Quick Autofill Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Quick Standard Presets (Click to autofill)
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_STANDARDS.map((std) => (
            <button
              key={std.name}
              type="button"
              onClick={() => applyTemplate(std)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-[#143e26]/10 hover:border-[#143e26]/30 text-gray-700 hover:text-[#143e26] transition-colors"
            >
              + {std.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Name / Standard Code <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="name"
            placeholder="e.g. ISO 9001:2015"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title / Certification Scope <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="title"
            placeholder="e.g. Quality Management System"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Authority / Body
          </label>
          <input
            type="text"
            name="issuingBody"
            placeholder="e.g. TÜV Rheinland / BSI / Bureau Veritas"
            value={formData.issuingBody}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Number
          </label>
          <input
            type="text"
            name="certificateNumber"
            placeholder="e.g. CERT-9001-UNI-2024"
            value={formData.certificateNumber}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry / Valid Till
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
          />
        </div>
      </div>

      {/* Cloudinary Certificate Image / Scan Upload */}
      <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/60 space-y-3">
        <label className="block text-sm font-medium text-gray-800">
          Certificate Scan / Image (Saved to Cloudinary)
        </label>
        <p className="text-xs text-gray-500">
          Upload an image (JPG, PNG, WEBP) of the official certificate document.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={(e) => handleFileUpload(e, 'image')}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg bg-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#143e26] file:text-white file:text-xs file:font-medium hover:file:bg-[#1b5534] disabled:opacity-50"
          />

          {uploadingImage && (
            <span className="text-xs font-semibold text-[#143e26] animate-pulse">
              Uploading certificate to Cloudinary...
            </span>
          )}

          {formData.imageUrl && !uploadingImage && (
            <div className="relative inline-block border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
              <img
                src={formData.imageUrl}
                alt="Certificate preview"
                className="h-20 w-28 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-sm"
                title="Remove certificate image"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="pt-1">
          <input
            type="text"
            name="imageUrl"
            placeholder="Or paste direct image URL (https://res.cloudinary.com/...)"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-600"
          />
        </div>
      </div>

      {/* Optional PDF Document Upload */}
      <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/60 space-y-3">
        <label className="block text-sm font-medium text-gray-800">
          PDF Certificate Document (Optional)
        </label>
        <p className="text-xs text-gray-500">
          Attach the full downloadable PDF version of the certificate.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <input
            type="file"
            accept="application/pdf"
            disabled={uploadingPdf}
            onChange={(e) => handleFileUpload(e, 'pdf')}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg bg-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#143e26] file:text-white file:text-xs file:font-medium hover:file:bg-[#1b5534] disabled:opacity-50"
          />

          {uploadingPdf && (
            <span className="text-xs font-semibold text-[#143e26] animate-pulse">
              Uploading PDF to Cloudinary...
            </span>
          )}

          {formData.pdfUrl && !uploadingPdf && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium">
              <FileText size={14} />
              <a
                href={formData.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="underline truncate max-w-xs"
              >
                View Uploaded PDF
              </a>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, pdfUrl: '' }))}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description / Scope Notes
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Brief details regarding the audit scope, certified facility, or standards body..."
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#143e26] focus:border-[#143e26] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first on the site</p>
        </div>

        <div className="flex items-center gap-3 self-center sm:pt-4">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={handleCheckbox}
            className="h-4 w-4 text-[#143e26] focus:ring-[#143e26] rounded border-gray-300"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-800">
            Active (Visible on public Certifications page)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/certificates')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || uploadingImage || uploadingPdf}
          className="bg-[#143e26] hover:bg-[#1b5534] text-white"
        >
          {loading
            ? 'Saving Certificate...'
            : uploadingImage || uploadingPdf
            ? 'Uploading to Cloudinary...'
            : 'Save Certificate'}
        </Button>
      </div>
    </form>
  );
}
