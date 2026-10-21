"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage showcase and client installation projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add Project
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-medium text-gray-600">Project Name</th>
              <th className="p-4 font-medium text-gray-600">Industry</th>
              <th className="p-4 font-medium text-gray-600">Location</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Visibility</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex justify-center items-center py-6">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary border-r-primary animate-spin" />
                  </div>
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No projects found. Add your first project!</td></tr>
            ) : (
              projects.map((p: any) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">/projects/{p.slug}</div>
                  </td>
                  <td className="p-4 text-gray-600">{p.category}</td>
                  <td className="p-4 text-gray-600">{p.location}</td>
                  <td className="p-4 text-xs text-gray-500">{p.status || 'Illustrative application'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700" title="View live on site">
                          <ExternalLink size={14} />
                        </Button>
                      </a>
                      <Link href={`/admin/projects/${p._id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Edit project">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p._id)} title="Delete project">
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
  );
}
