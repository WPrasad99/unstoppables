"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface UploadDataButtonProps {
  companyId: string;
  password: string;
  onSuccess: () => void;
}

export default function UploadDataButton({ companyId, password, onSuccess }: UploadDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsParsing(true);

    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => processData(results.data),
          error: (err: Error) => {
            setError("Failed to parse CSV: " + err.message);
            setIsParsing(false);
          }
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          processData(jsonData);
        } catch (err: any) {
          setError("Failed to parse Excel file: " + err.message);
          setIsParsing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processData = async (rawData: any[]) => {
    setIsParsing(false);
    setIsUploading(true);

    try {
      // Smart Column Mapping
      const mappedData = rawData.map(row => {
        const genderKey = Object.keys(row).find(k => 
          ["gender", "sex", "gen"].includes(k.toLowerCase().trim())
        );
        const decisionKey = Object.keys(row).find(k => 
          ["decision", "status", "result", "outcome"].includes(k.toLowerCase().trim())
        );

        if (!genderKey || !decisionKey) return null;

        return {
          gender: row[genderKey],
          decision: row[decisionKey],
          timestamp: row.timestamp || row.date || new Date().toISOString()
        };
      }).filter(Boolean);

      if (mappedData.length === 0) {
        throw new Error("Could not find required columns (Gender/Decision).");
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-company-id": companyId,
          "x-password": password
        },
        body: JSON.stringify({ decisions: mappedData })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      setSuccess(result.message);
      onSuccess();
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="btn-premium flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600/20 transition-all text-sm shadow-lg shadow-cyan-500/5 group"
      >
        <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
        Upload Historical Data
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg overflow-hidden border-white/10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold tracking-tight">Bulk Data Ingestion</h3>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400 leading-relaxed font-medium">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-400 leading-relaxed font-medium">{success}</p>
                  </motion.div>
                )}

                <div 
                  onClick={() => !isParsing && !isUploading && fileInputRef.current?.click()}
                  className={`relative group border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer bg-white/[0.02] ${isParsing || isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-white/20 hover:bg-white/[0.04] border-white/5'}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv, .xlsx, .xls" className="hidden" />
                  
                  {(isParsing || isUploading) ? (
                    <div className="space-y-4">
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin" />
                      </div>
                      <p className="text-cyan-400 font-bold tracking-tight">Processing {isParsing ? 'File' : 'Payload'}...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                          <FileText className="w-8 h-8 text-cyan-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold">Select Dataset</p>
                        <p className="text-sm text-gray-500">Supports CSV, XLS, XLSX formats</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] text-center">
                    Data must include <span className="text-gray-400">Gender</span> and <span className="text-gray-400">Decision</span> columns
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
