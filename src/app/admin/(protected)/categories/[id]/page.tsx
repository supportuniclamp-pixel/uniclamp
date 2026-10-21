"use client";
import { useEffect, useState, use } from 'react';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm initialData={data} />
    </div>
  );
}
