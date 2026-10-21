"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, Phone, Building, Calendar, CheckCircle } from 'lucide-react';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Client Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review incoming requests submitted through the contact page
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
            <p className="text-xs text-gray-400 mt-3">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No client enquiries received yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enquiries.map((item: any) => (
              <div key={item._id} className="p-6 hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.subject}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="font-semibold text-gray-700">{item.fullName}</span>
                      {item.company && (
                        <span className="flex items-center gap-1">
                          <Building size={13} /> {item.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail size={13} /> <a href={`mailto:${item.email}`} className="text-primary hover:underline">{item.email}</a>
                      </span>
                      {item.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={13} /> <a href={`tel:${item.phone}`} className="text-primary hover:underline">{item.phone}</a>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar size={13} /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={item.status || 'new'}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        item.status === 'resolved'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : item.status === 'contacted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(item._id)}
                      title="Delete enquiry"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {item.product && item.product !== 'General enquiry' && (
                  <div className="mb-2">
                    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded">
                      Product: {item.product}
                    </span>
                  </div>
                )}

                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100 whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
