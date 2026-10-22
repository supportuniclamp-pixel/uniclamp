"use client";

import { useState, useEffect } from 'react';
import {
  Award,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Building2,
  Calendar,
  Download,
  Sparkles,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Layout, Hero, Heading, Features } from '@/components/site';
import { Button } from '@/components/ui/button';
import { certificates as fallbackCertificates } from '@/lib/site-data';

interface CertItem {
  _id?: string;
  name: string;
  title: string;
  issuingBody?: string;
  certificateNumber?: string;
  imageUrl?: string;
  pdfUrl?: string;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
  isActive?: boolean;
}

export default function Quality() {
  const [certList, setCertList] = useState<CertItem[]>(fallbackCertificates);
  const [hasCustomCerts, setHasCustomCerts] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    fetch('/api/certificates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activeOnly = data.filter((c: CertItem) => c.isActive !== false);
          if (activeOnly.length > 0) {
            setCertList(activeOnly);
            setHasCustomCerts(true);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load certificates from API:', err);
      });
  }, []);

  const activeCert = index !== null ? certList[index] : null;

  return (
    <Layout>
      <Hero
        label="QUALITY WITHOUT COMPROMISE"
        title="Quality you can trust."
        description="A commitment to thoughtful engineering, responsible processes and continuous improvement."
      />

      <section className="section">
        <div className="container">
          <Heading
            label="QUALITY & STANDARDS"
            title="A foundation for better performance."
          />

          <p className="notice mb-8 text-sm text-muted-foreground max-w-2xl">
            {hasCustomCerts
              ? 'Official verified company certificates, accredited standards, and audited quality credentials for UNIclamp pipe support systems.'
              : 'Standard references below are previews only. Actual company certificates and issuing details have not been supplied.'}
          </p>

          {/* Bespoke Certificate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certList.map((c, i) => (
              <div
                key={c._id || c.name}
                className="group relative rounded-2xl bg-white border border-[#143e26]/15 hover:border-[#143e26]/50 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Decorative Metallic Brand Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#143e26] via-[#f6c042] to-[#143e26]" />

                {/* Full-Bleed Certificate Media Viewport */}
                {c.imageUrl ? (
                  <div
                    onClick={() => {
                      setIndex(i);
                      setZoom(false);
                    }}
                    className="relative h-[260px] w-full overflow-hidden bg-[#0c2617] cursor-pointer group/media"
                  >
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 block"
                    />

                    {/* Floating Top Left Security Stamp */}
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#143e26] text-[10.5px] font-extrabold uppercase tracking-wider shadow-md border border-[#143e26]/10">
                      <ShieldCheck size={14} className="text-[#f6c042]" />
                      Official Spec
                    </div>

                    {/* Floating Top Right Status Pill */}
                    <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#143e26]/90 backdrop-blur-md text-[#f6c042] text-[10px] font-bold uppercase tracking-wider shadow-md border border-[#f6c042]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f6c042] animate-pulse" />
                      Verified
                    </div>

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-gray-900 text-xs font-bold shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Maximize2 size={13} className="text-[#143e26]" /> Inspect Document
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setIndex(i);
                      setZoom(false);
                    }}
                    className="relative h-[260px] w-full bg-gradient-to-b from-[#f8faf8] to-[#edf3ed] flex items-center justify-center p-6 border-b border-gray-100 cursor-pointer group/media"
                  >
                    <div className="w-full h-full border-2 border-dashed border-[#143e26]/20 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-white/80 shadow-xs transition-transform group-hover:scale-[1.02]">
                      <div className="w-12 h-12 rounded-full bg-[#143e26]/10 text-[#143e26] flex items-center justify-center mb-3">
                        <Award size={26} />
                      </div>
                      <span className="text-[10px] font-extrabold tracking-widest text-[#143e26] uppercase">
                        Standard Reference
                      </span>
                      <strong className="text-base font-bold text-gray-900 mt-1">
                        {c.name}
                      </strong>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {c.title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Unique Certificate Card Body */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4 bg-white">
                  <div className="space-y-2.5">
                    {/* Header Row: Standard Name & Number Tag */}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-extrabold tracking-tight text-[#143e26] group-hover:text-emerald-950 transition-colors">
                        {c.name}
                      </h3>
                      {c.certificateNumber ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#143e26]/8 text-[#143e26] text-[11px] font-mono font-bold tracking-tight">
                          {c.certificateNumber}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold uppercase">
                          ISO Accredited
                        </span>
                      )}
                    </div>

                    {/* Scope / Title */}
                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                      {c.title}
                    </p>

                    {/* Description Notes */}
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {c.description ||
                        'Audited and verified standards compliance for precision pipe support and fixing systems.'}
                    </p>
                  </div>

                  {/* Metadata Chips: Authority & Validity */}
                  <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-600 truncate">
                      <Building2 size={13} className="text-[#143e26] shrink-0" />
                      <span className="truncate" title={c.issuingBody || 'Accredited Body'}>
                        {c.issuingBody || 'Accredited Body'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-600 justify-end">
                      <Calendar size={13} className="text-[#143e26] shrink-0" />
                      <span>
                        {c.expiryDate ? `Till ${c.expiryDate}` : 'Active Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(i);
                        setZoom(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#143e26] hover:text-[#1b5534] hover:underline"
                    >
                      {c.imageUrl ? 'View Certificate' : 'View Standard Preview'}
                      <ArrowUpRight size={14} />
                    </button>

                    {c.pdfUrl && (
                      <a
                        href={c.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-lg bg-[#143e26] text-white hover:bg-[#1b5534] transition-colors shadow-xs"
                        title="Download official PDF document"
                      >
                        <Download size={12} /> PDF Document
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container">
          <Heading label="OUR APPROACH" title="Quality is in the details." />
          <Features />
        </div>
      </section>

      {/* Certificate Modal Dialog */}
      <Dialog.Root
        open={index !== null}
        onOpenChange={(open) => {
          if (!open) setIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="modal-backdrop" />
          <Dialog.Content className="modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="modal-header flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#143e26]/10 text-[#143e26] flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} className="text-[#143e26]" />
                </div>
                <div>
                  <Dialog.Title className="text-xl font-extrabold text-[#143e26] tracking-tight">
                    {activeCert?.name}
                  </Dialog.Title>
                  <div className="text-xs text-gray-500 font-medium">
                    {activeCert?.title}
                  </div>
                </div>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close preview">
                  <X size={18} />
                </Button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="text-xs text-gray-500 py-3">
              {activeCert?.imageUrl
                ? 'Official verified compliance and quality credential issued to UNIclamp.'
                : 'Standard reference preview only · not an issued company certificate.'}
            </Dialog.Description>

            {activeCert && <Paper item={activeCert} zoom={zoom} />}

            {activeCert && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                {activeCert.issuingBody && (
                  <div>
                    Issuing Authority:{' '}
                    <span className="font-bold text-gray-900">{activeCert.issuingBody}</span>
                  </div>
                )}
                {activeCert.certificateNumber && (
                  <div>
                    Cert ID:{' '}
                    <span className="font-mono font-bold text-gray-900">
                      {activeCert.certificateNumber}
                    </span>
                  </div>
                )}
                {activeCert.expiryDate && (
                  <div>
                    Valid Till:{' '}
                    <span className="font-bold text-gray-900">{activeCert.expiryDate}</span>
                  </div>
                )}
                {activeCert.pdfUrl && (
                  <a
                    href={activeCert.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143e26] text-white hover:bg-[#1b5534] font-semibold text-xs shadow-xs"
                  >
                    <Download size={13} /> Download Certificate PDF
                  </a>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous standard"
                onClick={() =>
                  setIndex(((index ?? 0) + certList.length - 1) % certList.length)
                }
              >
                <ChevronLeft size={16} />
              </Button>

              <Button
                variant="outline"
                onClick={() => setZoom(!zoom)}
                className="text-xs font-semibold"
              >
                {zoom ? <ZoomOut className="mr-1.5" size={14} /> : <ZoomIn className="mr-1.5" size={14} />}
                {zoom ? 'Fit preview' : 'Enlarge preview'}
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label="Next standard"
                onClick={() =>
                  setIndex(((index ?? 0) + 1) % certList.length)
                }
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Layout>
  );
}

function Paper({ item, zoom = false }: { item: CertItem; zoom?: boolean }) {
  if (!item) return null;

  if (item.pdfUrl) {
    return (
      <div
        className={`relative w-full rounded-lg border border-gray-300 bg-gray-100 overflow-hidden shadow-inner transition-all ${
          zoom ? 'h-[750px]' : 'h-[520px]'
        }`}
      >
        <iframe
          src={`${item.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          title={item.name}
          className="w-full h-full border-none bg-white"
          loading="lazy"
        />
      </div>
    );
  }

  if (item.imageUrl) {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center bg-gray-50 rounded-lg border border-gray-300 transition-all ${
          zoom ? 'min-h-[580px] p-2' : 'min-h-[420px] p-4'
        }`}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className={`object-contain max-h-full max-w-full rounded transition-transform duration-200 ${
            zoom ? 'scale-110' : 'scale-100'
          }`}
          style={{ maxHeight: zoom ? '540px' : '390px' }}
        />
      </div>
    );
  }

  return (
    <div className={`cert-paper ${zoom ? 'min-h-[560px]' : ''}`}>
      <Award size={45} />
      <span className="eyebrow mb-6">CERTIFICATE RECORD</span>
      <strong>{item.name}</strong>
      <p>{item.title}</p>
      <small>{item.certificateNumber}</small>
    </div>
  );
}
