"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  FileCode,
  Archive,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileText
} from "lucide-react";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportSummary {
  totalRecords: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
  imported: Array<{ name: string; slug: string; id: string }>;
  skipped: Array<{ name: string; slug: string; reason: string }>;
  errors: Array<{ index?: number; row?: number; name?: string; message: string }>;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetState = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setIsTemplateLoading(false);
    setSummary(null);
    setGeneralError(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (summary && summary.importedCount > 0) {
      onSuccess();
    }
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setGeneralError(null);
      setSummary(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (["json", "csv", "zip"].includes(ext || "")) {
        setSelectedFile(file);
        setGeneralError(null);
        setSummary(null);
      } else {
        setGeneralError("Unsupported file type. Please upload a .json, .csv, or .zip file.");
      }
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!selectedFile) {
      setGeneralError("Please choose a file to import.");
      return;
    }

    setIsUploading(true);
    setGeneralError(null);
    setSummary(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/products/bulk", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || "Failed to process bulk import.");
        if (data.details) {
          setSummary({
            totalRecords: 0,
            importedCount: 0,
            skippedCount: 0,
            failedCount: 1,
            imported: [],
            skipped: [],
            errors: [{ message: data.details }],
          });
        }
      } else {
        setSummary({
          totalRecords: data.totalRecords || 0,
          importedCount: data.importedCount || 0,
          skippedCount: data.skippedCount || 0,
          failedCount: data.failedCount || 0,
          imported: data.imported || [],
          skipped: data.skipped || [],
          errors: data.errors || [],
        });
        if (data.importedCount > 0) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || "Network error while uploading products.");
    } finally {
      setIsUploading(false);
    }
  };

  // Quick 1-click import of the 14 sample UNiclamp products
  const handleQuickImportSample = async () => {
    setIsTemplateLoading(true);
    setGeneralError(null);
    setSummary(null);

    try {
      const resSample = await fetch("/sample-products.json");
      if (!resSample.ok) throw new Error("Could not fetch sample-products.json");
      const sampleBlob = await resSample.blob();
      const sampleFile = new File([sampleBlob], "sample-products.json", {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", sampleFile);

      const res = await fetch("/api/products/bulk", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setGeneralError(data.error || "Failed to import sample catalogue.");
      } else {
        setSummary({
          totalRecords: data.totalRecords || 0,
          importedCount: data.importedCount || 0,
          skippedCount: data.skippedCount || 0,
          failedCount: data.failedCount || 0,
          imported: data.imported || [],
          skipped: data.skipped || [],
          errors: data.errors || [],
        });
        if (data.importedCount > 0) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || "Failed to quick-import sample products.");
    } finally {
      setIsTemplateLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-2xl md:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Bulk Product Import</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Upload a JSON, CSV, or ZIP file containing multiple UNiclamp products.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Templates & Quick Action Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
          <div>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> Need a sample template?
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Download pre-formatted templates matching UNiclamp specifications:
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/sample-products.json"
              download="uniclamp-sample-products.json"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              Sample JSON
              <Download className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="/sample-products.csv"
              download="uniclamp-sample-products.csv"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Sample CSV
              <Download className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* 1-Click Import Option */}
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">
                1-Click Import: Official 14 UNiclamp Catalogue
              </p>
              <p className="text-[11px] text-slate-500">
                Instantly import split clamps, rubber lined, u-bolts, cantilever arms, and anti-vibration products.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="default"
            className="text-xs shrink-0 font-medium"
            disabled={isUploading || isTemplateLoading}
            onClick={handleQuickImportSample}
          >
            {isTemplateLoading ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Importing...
              </>
            ) : (
              "Import 14 Products"
            )}
          </Button>
        </div>

        {/* File Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99]"
              : selectedFile
              ? "border-emerald-500 bg-emerald-50/40"
              : "border-slate-300 hover:border-primary/60 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv,.zip,application/json,text/csv,application/zip"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {selectedFile ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-semibold text-slate-800 text-sm">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click or drop another file to replace
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">
                    Drag & drop your product data file here, or{" "}
                    <span className="text-primary font-semibold underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports <b>.json</b>, <b>.csv</b>, or <b>.zip</b> (containing images + csv/json)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Information Callout */}
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
          <p className="font-medium text-slate-700">Supported Product Fields:</p>
          <p>
            &bull; <b>Required:</b> Product Name, Category.
          </p>
          <p>
            &bull; <b>Optional:</b> Slug (auto-generated if empty), Short Description, Full Description, Main Image, Specification Diagram Image, Key Specifications (key-value pairs / JSON), and Active status.
          </p>
          <p>
            &bull; <b>Duplicate Handling:</b> Products matching existing database slugs or names are automatically skipped with zero data loss.
          </p>
        </div>

        {/* General Error Display */}
        {generalError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium">Import Error</p>
              <p className="mt-0.5">{generalError}</p>
            </div>
          </div>
        )}

        {/* Results / Summary Display */}
        {summary && (
          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" /> Import Results Summary
            </h4>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Total Found</span>
                <span className="text-lg font-bold text-slate-800">
                  {summary.totalRecords}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <span className="text-xs text-emerald-600 block font-medium">Imported</span>
                <span className="text-lg font-bold text-emerald-700">
                  {summary.importedCount}
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <span className="text-xs text-amber-600 block font-medium">Skipped (Duplicates)</span>
                <span className="text-lg font-bold text-amber-700">
                  {summary.skippedCount}
                </span>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                <span className="text-xs text-red-600 block font-medium">Failed</span>
                <span className="text-lg font-bold text-red-700">
                  {summary.failedCount}
                </span>
              </div>
            </div>

            {/* Imported List */}
            {summary.imported.length > 0 && (
              <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-3 text-xs">
                <p className="font-semibold text-emerald-800 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Successfully Imported ({summary.imported.length}):
                </p>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {summary.imported.map((item, idx) => (
                    <div key={idx} className="text-emerald-700 flex justify-between">
                      <span className="font-medium truncate mr-2">&bull; {item.name}</span>
                      <span className="text-[11px] text-emerald-600 font-mono shrink-0">
                        /{item.slug}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skipped List */}
            {summary.skipped.length > 0 && (
              <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-3 text-xs">
                <p className="font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Skipped Duplicates ({summary.skipped.length}):
                </p>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {summary.skipped.map((item, idx) => (
                    <div key={idx} className="text-amber-700 flex justify-between">
                      <span className="truncate mr-2">&bull; {item.name}</span>
                      <span className="text-[11px] text-amber-600 shrink-0">
                        {item.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors List */}
            {summary.errors.length > 0 && (
              <div className="border border-red-200 bg-red-50/50 rounded-lg p-3 text-xs">
                <p className="font-semibold text-red-800 flex items-center gap-1.5 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Validation / Processing Errors ({summary.errors.length}):
                </p>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {summary.errors.map((err, idx) => (
                    <div key={idx} className="text-red-700">
                      &bull; {err.name ? <b>{err.name}: </b> : null}
                      {err.row || err.index ? <span>Row {err.row || err.index}: </span> : null}
                      {err.message || (err as any).error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {summary ? "Done" : "Cancel"}
          </Button>
          {!summary && (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isTemplateLoading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Importing Products...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Import
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
