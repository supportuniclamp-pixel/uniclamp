"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSpecImage, setUploadingSpecImage] = useState(false);
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
    specificationImage: initialData?.specificationImage || '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        category: initialData.category?._id || initialData.category || '',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        specifications: initialData.specifications || [],
        images: initialData.images || [],
        specificationImage: initialData.specificationImage || '',
      });
    }
  }, [initialData]);

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

  const handleSpecImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSpecImage(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload specification image');
      }

      const result = await res.json();
      setFormData(prev => ({ ...prev, specificationImage: result.url }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Specification image upload failed');
    } finally {
      setUploadingSpecImage(false);
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
        alert(initialData ? 'Product updated successfully!' : 'Product created successfully!');
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Main Image</label>
        <div className="space-y-3">
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
          </div>
          {formData.images.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="relative inline-block flex-shrink-0">
                <img src={formData.images[0]} alt="Main Preview" className="h-20 w-20 object-cover rounded-md border border-gray-300 shadow-sm" />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, images: [] }))} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="text-xs text-gray-600 min-w-0 flex-1">
                <span className="font-semibold text-green-700 block mb-0.5">✓ Uploaded to Cloudinary</span>
                <a href={formData.images[0]} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate block" title={formData.images[0]}>
                  {formData.images[0]}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Specifications &amp; Packaging Diagram / Image
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload technical drawing, dimension diagram, or packaging chart for this product.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                disabled={uploadingSpecImage}
                onChange={handleSpecImageUpload} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white disabled:opacity-50" 
              />
              {uploadingSpecImage && (
                <span className="text-xs text-primary font-medium animate-pulse whitespace-nowrap">
                  Uploading to Cloudinary...
                </span>
              )}
            </div>
            {formData.specificationImage && (
              <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-md">
                <div className="relative inline-block flex-shrink-0">
                  <img src={formData.specificationImage} alt="Spec Diagram Preview" className="h-20 w-20 object-contain rounded-md border border-gray-300 bg-neutral-50 p-1 shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, specificationImage: '' }))} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                    title="Remove specification diagram"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="text-xs text-gray-600 min-w-0 flex-1">
                  <span className="font-semibold text-green-700 block mb-0.5">✓ Uploaded to Cloudinary</span>
                  <a href={formData.specificationImage} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate block" title={formData.specificationImage}>
                    {formData.specificationImage}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div>
              <h3 className="font-medium text-gray-800">Key Specifications (Key-Value Pairs)</h3>
              <p className="text-xs text-gray-500">e.g. Type, Sizes, Finish, Min Load, Max Load</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    specifications: [
                      { key: 'Type', value: 'Anti Vibration Isolator' },
                      { key: 'Sizes', value: 'Min – 50kg, 100kg | Max – Customization available' },
                      { key: 'Finish', value: 'Painted' },
                      { key: 'Min Load', value: 'As per Size' },
                      { key: 'Max Load', value: 'As per Size' },
                    ]
                  }));
                }} 
                className="text-xs"
              >
                Insert Standard Specs
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={addSpecification} className="flex items-center gap-2">
                <Plus size={14} /> Add Spec
              </Button>
            </div>
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
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={handleCheckbox} className="h-4 w-4 text-primary rounded" />
        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active (Visible on website)</label>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
        <Button type="submit" disabled={loading || uploadingImage || uploadingSpecImage}>
          {loading ? 'Saving Product...' : (uploadingImage || uploadingSpecImage) ? 'Uploading image...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
