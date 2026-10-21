"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Building2,
  Award,
  MessageSquare,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import uniclampMark from '@/assets/uniclamp-mark.png';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Projects', href: '/admin/projects', icon: Building2 },
    { label: 'Certificates', href: '/admin/certificates', icon: Award },
    { label: 'Client Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f9f6] text-gray-900 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with UNIclamp Brand Theme */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#113420] text-white flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-[#1a4a2f] shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1b4d31] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex flex-col gap-1 select-none">
            <img
              src={typeof uniclampMark === 'string' ? uniclampMark : (uniclampMark as any).src}
              alt="UNIclamp"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[10px] uppercase tracking-widest text-[#f6c042] font-semibold mt-1">
              Admin Console
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Main Management
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? 'bg-[#18482d] text-white shadow-sm border border-[#24613d]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#f6c042] rounded-r-md" />
                )}
                <Icon
                  size={19}
                  className={`transition-colors ${
                    active ? 'text-[#f6c042]' : 'text-white/60 group-hover:text-white'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={15} className="text-[#f6c042]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-[#1b4d31] bg-[#0c2617]/50 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#f6c042] bg-[#f6c042]/10 hover:bg-[#f6c042]/20 rounded-md transition-colors border border-[#f6c042]/20"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink size={14} /> Live Website
            </span>
            <span className="text-[10px] bg-[#f6c042] text-[#113420] px-1.5 py-0.5 rounded font-bold">
              PORTAL
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-white/70 hover:text-white hover:bg-red-500/20 rounded-md transition-colors text-red-200"
          >
            <LogOut size={16} /> Secure Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={16} className="text-[#143e26]" />
              <span className="font-semibold text-gray-800">UNIclamp</span>
              <span>/</span>
              <span className="capitalize text-[#143e26] font-medium">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Atlas DB Active
            </div>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#143e26] hover:bg-emerald-50 rounded-md transition-colors border border-emerald-200/70"
            >
              View Site <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
