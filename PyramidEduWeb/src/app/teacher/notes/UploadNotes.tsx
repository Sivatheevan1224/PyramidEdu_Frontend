"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useId, useRef, useState } from "react";

export default function UploadNotes() {
  const fileInputId = useId();
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-3">Upload Notes & Materials</h3>
      <label htmlFor={fileInputId} className="sr-only">
        Select files to upload
      </label>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        multiple
        aria-label="Select files to upload"
        onChange={handleChange}
        className="hidden"
      />
      {/* Drag‑and‑drop area */}
      <div
        className="mb-4 flex flex-col items-center justify-center rounded border border-dashed border-muted-foreground/30 p-6 text-center cursor-pointer transition-colors hover:bg-muted/20"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="text-sm text-muted-foreground">Drag & drop files here, or click to select</p>
      </div>
      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={() => fileInputRef.current?.click()}>Select Files</Button>
        {files.length > 0 && (
          <Button variant="destructive" onClick={() => setFiles([])}>
            Clear All
          </Button>
        )}
      </div>
      {files.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground mt-4">
            {files.map((f, idx) => (
              <li key={f.name} className="flex justify-between items-center">
                <span>{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                <Button variant="ghost" size="sm" onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}>Remove</Button>
              </li>
            ))}
        </ul>
      )}
    </Card>
  );
}
