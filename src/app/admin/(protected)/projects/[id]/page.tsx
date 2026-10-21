"use client";
import { useEffect, useState, use } from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm initialData={data} />
    </div>
  );
}
