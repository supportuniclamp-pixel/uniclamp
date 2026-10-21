"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  Building2,
  Award,
  MessageSquare,
  ArrowRight,
  Plus,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Sparkles,
  TrendingUp,
  Mail,
  Building,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsState {
  products: number;
  categories: number;
  projects: number;
  certificates: number;
  enquiries: number;
  newEnquiries: number;
  publishedProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsState>({
    products: 0,
    categories: 0,
    projects: 0,
    certificates: 0,
    enquiries: 0,
    newEnquiries: 0,
    publishedProducts: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [prodRes, catRes, projRes, enqRes, certRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/projects'),
        fetch('/api/enquiries'),
        fetch('/api/certificates'),
      ]);

      const products = await prodRes.json();
      const categories = await catRes.json();
      const projects = await projRes.json();
      const enquiries = await enqRes.json();
      const certificates = await certRes.json();

      const prodList = Array.isArray(products) ? products : [];
      const catList = Array.isArray(categories) ? categories : [];
      const projList = Array.isArray(projects) ? projects : [];
      const enqList = Array.isArray(enquiries) ? enquiries : [];
      const certList = Array.isArray(certificates) ? certificates : [];

      const newEnqCount = enqList.filter((e: any) => !e.status || e.status === 'new').length;
      const publishedCount = prodList.filter((p: any) => p.isActive !== false).length;

      setStats({
        products: prodList.length,
        categories: catList.length,
        projects: projList.length,
        certificates: certList.length,
        enquiries: enqList.length,
        newEnquiries: newEnqCount,
        publishedProducts: publishedCount,
      });

      setRecentEnquiries(enqList.slice(0, 5));
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner - UNIclamp Forest Green & Gold Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2a19] via-[#143e26] to-[#1c5535] text-white p-6 sm:p-8 shadow-xl border border-[#225738]">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#f6c042]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6c042]/15 border border-[#f6c042]/30 text-[#f6c042] text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={13} className="text-[#f6c042]" />
              UNIclamp Operations Console
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back to Admin Center
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Manage your industrial catalog, track incoming customer enquiries, and monitor site showcase performance in real-time.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/60">
              <span suppressHydrationWarning className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#f6c042]" />
                {currentDateFormatted}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Atlas Synced
              </span>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              disabled={isRefreshing}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium backdrop-blur-sm transition-all"
            >
              <RefreshCw size={14} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Link href="/admin/products">
              <Button className="bg-[#f6c042] hover:bg-[#eab332] text-[#113420] font-bold text-xs shadow-md transition-transform hover:scale-[1.02]">
                <Plus size={15} className="mr-1" /> Add Product
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                className="bg-white/5 hover:bg-white/15 text-white border-white/20 text-xs font-medium"
              >
                Live Store <ExternalLink size={13} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Card */}
        <Link
          href="/admin/products"
          className="group relative bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#143e26]/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#143e26]/10 text-[#143e26] flex items-center justify-center group-hover:bg-[#143e26] group-hover:text-white transition-colors duration-300">
                <Package size={22} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Catalog
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {loading ? '—' : stats.products}
              </div>
              <p className="text-sm font-semibold text-gray-600 mt-1">Total Products</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading ? 'Fetching...' : `${stats.publishedProducts} active in store`}
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#143e26] group-hover:text-[#194e30]">
            <span>Manage Products</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Categories Card */}
        <Link
          href="/admin/categories"
          className="group relative bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#143e26]/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors duration-300">
                <FolderTree size={22} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                Taxonomy
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {loading ? '—' : stats.categories}
              </div>
              <p className="text-sm font-semibold text-gray-600 mt-1">Categories</p>
              <p className="text-xs text-gray-400 mt-0.5">Organized product ranges</p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-900">
            <span>Manage Categories</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="group relative bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#143e26]/30 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Building2 size={22} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Portfolio
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {loading ? '—' : stats.projects}
              </div>
              <p className="text-sm font-semibold text-gray-600 mt-1">Total Projects</p>
              <p className="text-xs text-gray-400 mt-0.5">Showcase installations</p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900">
            <span>Manage Projects</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Client Enquiries Card */}
        <Link
          href="/admin/enquiries"
          className="group relative bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#f6c042]/80 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                <MessageSquare size={22} />
              </div>
              {stats.newEnquiries > 0 ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
                  {stats.newEnquiries} New
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  All Clear
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {loading ? '—' : stats.enquiries}
              </div>
              <p className="text-sm font-semibold text-gray-600 mt-1">Client Inquiries</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {stats.newEnquiries > 0
                  ? `${stats.newEnquiries} awaiting review`
                  : 'All inquiries addressed'}
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
            <span>Review Enquiries</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Main Split Grid: Recent Inquiries + Operations Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Client Enquiries Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#143e26]/10 text-[#143e26]">
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Client Inquiries</h2>
                <p className="text-xs text-gray-500">Latest customer leads submitted from the portal</p>
              </div>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#143e26] hover:text-[#1f5c3a] flex items-center gap-1 transition-colors"
            >
              View All ({stats.enquiries}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#143e26]/20 border-t-[#143e26] animate-spin mx-auto" />
                <p className="text-xs text-gray-400 mt-3">Loading inquiries...</p>
              </div>
            ) : recentEnquiries.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} />
                </div>
                <h3 className="text-sm font-bold text-gray-700">No Inquiries Found</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                  When potential clients submit the contact enquiry form, they will immediately appear here.
                </p>
              </div>
            ) : (
              recentEnquiries.map((item: any) => {
                const status = item.status || 'new';
                return (
                  <div
                    key={item._id}
                    className="p-5 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {status}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {item.subject || 'Product Specification Enquiry'}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          <User size={12} className="text-gray-400" />
                          {item.fullName}
                        </span>
                        {item.company && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <Building size={12} className="text-gray-400" />
                            {item.company}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-1 italic bg-gray-50/80 px-2.5 py-1 rounded border border-gray-100 max-w-xl">
                        "{item.message}"
                      </p>
                    </div>

                    <div className="flex items-center sm:self-center shrink-0">
                      <Link
                        href="/admin/enquiries"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#143e26] hover:border-[#143e26]/30 hover:bg-emerald-50/50 transition-colors"
                      >
                        Respond & Update
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Operations & System Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-500">
              Quick Management
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#fbfdfb] hover:border-[#143e26]/30 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#143e26]/10 text-[#143e26] flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Add New Product</div>
                    <div className="text-[11px] text-gray-500">Upload clamp specs & imagery</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#143e26] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#fbfdfb] hover:border-[#143e26]/30 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Add Project Case</div>
                    <div className="text-[11px] text-gray-500">Showcase recent installations</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#fbfdfb] hover:border-[#143e26]/30 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FolderTree size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Categories & Series</div>
                    <div className="text-[11px] text-gray-500">Standard, Heavy, Twin & Custom</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/certificates"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#fbfdfb] hover:border-[#143e26]/30 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#143e26] flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Upload & Manage Certificates</div>
                    <div className="text-[11px] text-gray-500">ISO, CE & QA standards on Cloudinary ({stats.certificates})</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#143e26] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl border border-amber-200/60 bg-amber-50/40 hover:bg-amber-50/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f6c042]/30 text-amber-900 flex items-center justify-center">
                    <ExternalLink size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Preview Live Portal</div>
                    <div className="text-[11px] text-gray-600">Open client-facing storefront</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-amber-800" />
              </Link>
            </div>
          </div>

          {/* System & Database Status Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-500">
                System Infrastructure
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} /> Healthy
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Database size={14} className="text-[#143e26]" /> Database Engine
                </span>
                <span className="font-semibold text-gray-800">MongoDB Atlas Cluster</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#143e26]" /> Runtime
                </span>
                <span className="font-semibold text-gray-800">Next.js 15 (Edge Ready)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <AlertCircle size={14} className="text-[#143e26]" /> Auth Protocol
                </span>
                <span className="font-semibold text-gray-800">JWT Admin Session</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-500">Last synchronized</span>
                <span suppressHydrationWarning className="font-mono text-gray-600 text-[11px]">
                  {mounted && lastRefreshed
                    ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : '--:--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
