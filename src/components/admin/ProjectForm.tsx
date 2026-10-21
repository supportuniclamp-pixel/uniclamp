"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Industrial',
  'Commercial',
  'Infrastructure',
  'Energy',
  'Healthcare',
  'Hospitality'
];

export function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Industrial',
    location: initialData?.location || '',
    status: initialData?.status || 'Illustrative application',
    description: initialData?.description || '',
    overviewTitle: initialData?.overviewTitle || 'Engineering the connections.',
    detailedDescription: initialData?.detailedDescription || '',
    challenge: initialData?.challenge || 'Coordinate multiple service installations while maintaining accessible, adaptable and reliable support structures.',
    approach: initialData?.approach || 'Combine modular strut channels, pipe supports and compatible fixing systems to develop an integrated solution around the project specification.',
    image: initialData?.image || '',
    isActive: initialData?.isActive ?? true,
    displayOrder: initialData?.displayOrder ?? 0,
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !initialData) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image to Cloudinary');
      }

      const result = await res.json();
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/projects/${initialData._id}` : '/api/projects';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            required
            type="text"
            name="name"
            placeholder="e.g. Industrial Manufacturing Facility"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly) *</label>
          <input
            required
            type="text"
            name="slug"
            placeholder="e.g. industrial-manufacturing-facility"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Industry / Category *</label>
          </div>
          <div className="space-y-2">
            <select
              name="category"
              value={CATEGORY_OPTIONS.includes(formData.category) ? formData.category : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setFormData(prev => ({ ...prev, category: '' }));
                } else {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-sm"
            >
              <option value="" disabled>Select category</option>
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="custom">+ Add New Custom Category</option>
            </select>
            {(!CATEGORY_OPTIONS.includes(formData.category) || formData.category === '') && (
              <input
                required
                type="text"
                name="category"
                placeholder="Type new category name..."
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-primary/50 bg-primary/5 rounded-md focus:ring-primary focus:border-primary text-sm"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sample Location *</label>
          <input
            required
            type="text"
            name="location"
            placeholder="e.g. Pune, India"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <input
            type="text"
            name="status"
            placeholder="e.g. Illustrative application"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description *</label>
        <textarea
          required
          name="description"
          rows={3}
          placeholder="Brief overview summary shown on hero banner and project cards"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        ></textarea>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Overview Section</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overview Title</label>
          <input
            type="text"
            name="overviewTitle"
            placeholder="e.g. Engineering the connections."
            value={formData.overviewTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Overview Details (Optional)</label>
          <textarea
            name="detailedDescription"
            rows={3}
            placeholder="Additional narrative text shown below overview title"
            value={formData.detailedDescription}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">The Challenge</label>
          <textarea
            name="challenge"
            rows={3}
            value={formData.challenge}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Our Approach</label>
          <textarea
            name="approach"
            rows={3}
            value={formData.approach}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white disabled:opacity-50"
          />
          {uploadingImage && (
            <span className="text-xs text-primary font-medium animate-pulse whitespace-nowrap">
              Uploading to Cloudinary...
            </span>
          )}
          {formData.image && !uploadingImage && (
            <div className="relative inline-block flex-shrink-0">
              <img src={formData.image} alt="Preview" className="h-16 w-24 object-cover rounded-md border border-gray-200" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Or paste direct image URL below if not uploading a file:</p>
        <input
          type="text"
          placeholder="https://images.unsplash.com/..."
          value={formData.image.startsWith('data:') ? '' : formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={handleCheckbox}
          className="h-4 w-4 text-primary rounded"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active (Visible on website)</label>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')}>Cancel</Button>
        <Button type="submit" disabled={loading || uploadingImage}>
          {loading ? 'Saving...' : uploadingImage ? 'Uploading image...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
}
