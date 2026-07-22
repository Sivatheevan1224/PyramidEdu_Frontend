"use client";

import React, { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, FileText, Loader2, Upload, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type PdfToTextResponse = {
  error?: string;
  text?: string;
};

export default function PdfToTextConverter() {
  const fileInputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedText, setConvertedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(null);
    setConvertedText("");
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setMessage(null);
    const toastId = toast.loading("Converting PDF to text via PDF.co...");

    try {
      const response = await fetch("/api/pdf/to-text", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as PdfToTextResponse;

      if (!response.ok) {
        throw new Error(data?.error || "PDF conversion failed.");
      }

      const text = typeof data?.text === "string" ? data.text : "";
      setConvertedText(text);
      if (text) {
        toast.success("PDF converted to text successfully!", { id: toastId });
        setMessage("PDF converted successfully.");
      } else {
        toast.info("Conversion finished, but no text was found.", { id: toastId });
        setMessage("Conversion finished, but no text was returned.");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to convert PDF.";
      toast.error(msg, { id: toastId });
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!convertedText) return;
    try {
      await navigator.clipboard.writeText(convertedText);
      setCopied(true);
      toast.success("Converted text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              PDF to Text Converter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quickly extract plain text from any PDF document using PDF.co.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shrink-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Upload className="w-4 h-4 mr-1.5 text-indigo-500" />
          Select PDF
        </Button>
      </div>

      <label htmlFor={fileInputId} className="sr-only">
        Select a PDF file to convert
      </label>
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag and Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0] ?? null;
          if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setMessage(null);
            setConvertedText("");
          } else if (file) {
            toast.error("Please drop a PDF file.");
          }
        }}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
          selectedFile
            ? "border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10"
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <FileText className={`w-8 h-8 ${selectedFile ? "text-indigo-600" : "text-slate-400"}`} />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {selectedFile ? selectedFile.name : "Drag and drop a PDF file here, or click to select"}
          </p>
          <p className="text-[11px] text-slate-400">
            {selectedFile
              ? `${(selectedFile.size / 1024).toFixed(1)} KB — Ready to convert`
              : "Supports PDF documents up to 50MB"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleConvert}
            disabled={!selectedFile || loading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 h-9 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert PDF"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={!convertedText}
            className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold h-9 cursor-pointer disabled:opacity-50"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Copy Text
              </>
            )}
          </Button>
        </div>

        {message && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
            {message}
          </span>
        )}
      </div>

      {/* Extracted Text Output Area */}
      <div className="space-y-2 pt-1">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Extracted Text Output
        </label>
        <Textarea
          value={convertedText}
          readOnly
          placeholder="Converted text will appear here. You can copy it for note descriptions or course content."
          className="min-h-[160px] max-h-[300px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl text-xs leading-relaxed resize-y focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </Card>
  );
}
