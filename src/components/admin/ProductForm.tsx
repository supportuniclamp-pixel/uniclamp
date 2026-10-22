"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category?._id || initialData?.category || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
    specifications: (initialData?.specifications || []) as Array<{ key: string; value: string }>,
    images: (initialData?.images || []) as string[],
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const addSpecification = () => {
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => {
      const specs = [...prev.specifications];
      specs.splice(index, 1);
      return { ...prev, specifications: specs };
    });
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const specs = [...prev.specifications];
      specs[index][field] = value;
      return { ...prev, specifications: specs };
    });
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
      setFormData(prev => ({ ...prev, images: [result.url] }));
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
      const url = initialData ? `/api/products/${initialData._id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push('/admin/products');
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white">
          <option value="">Select a category</option>
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
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
          {formData.images.length > 0 && !uploadingImage && (
            <div className="relative inline-block flex-shrink-0">
              <img src={formData.images[0]} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-gray-200" />
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, images: [] }))} 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800">Specifications</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSpecification} className="flex items-center gap-2">
            <Plus size={14} /> Add Spec
          </Button>
        </div>
        
        {formData.specifications.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No specifications added yet.</p>
        ) : (
          <div className="space-y-3">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. Material" 
                  value={spec.key} 
                  onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)} 
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm" 
                  required
                />
                <input 
                  type="text" 
                  placeholder="e.g. Stainless Steel" 
                  value={spec.value} 
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} 
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm" 
                  required
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeSpecification(index)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={handleCheckbox} className="h-4 w-4 text-primary rounded" />
        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active (Visible on website)</label>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
        <Button type="submit" disabled={loading || uploadingImage}>
          {loading ? 'Saving...' : uploadingImage ? 'Uploading image...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
