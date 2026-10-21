"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = initialData ? `/api/categories/${initialData._id}` : '/api/categories';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push('/admin/categories');
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
        <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={handleCheckbox} className="h-4 w-4 text-primary rounded" />
        <label htmlFor="isActive" className="text-sm text-gray-700">Active (Visible on site)</label>
      </div>
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Category'}</Button>
      </div>
    </form>
  );
}
