"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, FileText, Loader2, Upload } from "lucide-react";

type PdfToTextResponse = {
  error?: string;
  text?: string;
};

export default function PdfToTextConverter() {
  const fileInputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedText, setConvertedText] = useState("");
  const [loading, setLoading] = useState(false);
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
      setMessage("Select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setMessage(null);

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
      setMessage(text ? "PDF converted to text successfully." : "Conversion finished, but no text was returned.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to convert the PDF.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!convertedText) {
      return;
    }

    await navigator.clipboard.writeText(convertedText);
    setMessage("Converted text copied to clipboard.");
  };

  return (
    <Card className="border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <FileText className="h-4 w-4 text-primary" />
            PDF to Text Converter
          </h3>
          <p className="text-xs text-muted-foreground">
            Upload a PDF and convert it to plain text with PDF.co before building your quiz.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
        >
          <Upload className="h-4 w-4" />
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
        aria-label="Select a PDF file to convert"
        onChange={handleFileChange}
      />

      <div
        className="mb-4 rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0] ?? null;
          if (file) {
            setSelectedFile(file);
            setMessage(null);
            setConvertedText("");
          }
        }}
      >
        <p className="text-sm font-medium">Drag and drop a PDF here, or click to choose one.</p>
        <p className="mt-1 text-xs text-muted-foreground">The file stays in the browser until you convert it.</p>
        {selectedFile && (
          <p className="mt-3 text-xs text-foreground">
            Selected: <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="hero" onClick={handleConvert} disabled={!selectedFile || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Converting..." : "Convert PDF"}
        </Button>
        <Button type="button" variant="soft" onClick={handleCopy} disabled={!convertedText}>
          <Copy className="h-4 w-4" />
          Copy text
        </Button>
      </div>

      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}

      <div className="mt-4 space-y-2">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Extracted Text</label>
        <Textarea
          value={convertedText}
          readOnly
          placeholder="Converted text will appear here and can be used to draft quiz questions."
          className="min-h-[220px] resize-y"
        />
      </div>
    </Card>
  );
}