"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { BulkImportModal } from '@/components/admin/BulkImportModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, add, and bulk import catalogue items.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-300 shadow-sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={16} /> Import Products
          </Button>
          <Link href="/admin/products/new">
            <Button className="flex items-center gap-2 shadow-sm">
              <Plus size={16} /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => fetchProducts()}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Category</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <div className="flex justify-center items-center py-6">
                    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary border-r-primary animate-spin" />
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No products found. Create one!</td></tr>
            ) : (
              products.map((p: any) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-gray-500">{p.category?.name || 'Uncategorized'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${p.slug}`} target="_blank" title="View on site">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                          <Eye size={14} />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/${p._id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p._id)}>
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
