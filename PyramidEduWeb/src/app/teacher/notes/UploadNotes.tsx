"use client";

import { useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, BookOpen, FileText, Upload, X } from "lucide-react";

const batchOptions = ["2026 A/L", "2025 A/L", "2024 A/L", "2023 A/L", "Other"];

const acceptedExtensions = [".pdf", ".doc", ".docx"];
const acceptedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type NoteUploadPayload = {
  title: string;
  subject: string;
  batch: string;
  description: string;
  files: File[];
};

interface UploadNotesProps {
  subject: string;
  teacherName?: string;
  onSubmit?: (payload: NoteUploadPayload) => void;
}

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isAcceptedDocument = (file: File) => {
  const lowerName = file.name.toLowerCase();

  return (
    acceptedExtensions.some((extension) => lowerName.endsWith(extension)) ||
    acceptedMimeTypes.has(file.type)
  );
};

const addUniqueFiles = (existingFiles: File[], incomingFiles: File[]) => {
  const nextFiles = [...existingFiles];

  incomingFiles.forEach((file) => {
    const exists = nextFiles.some(
      (current) =>
        current.name === file.name &&
        current.size === file.size &&
        current.lastModified === file.lastModified,
    );

    if (!exists) {
      nextFiles.push(file);
    }
  });

  return nextFiles;
};

export default function UploadNotes({ subject, teacherName, onSubmit }: Readonly<UploadNotesProps>) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batch, setBatch] = useState("");
  const [customBatch, setCustomBatch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const appendFiles = (incomingFiles: File[]) => {
    const validFiles = incomingFiles.filter(isAcceptedDocument);

    if (validFiles.length < incomingFiles.length) {
      setError("Only PDF, DOC, and DOCX files are allowed.");
    }

    setFiles((prev) => addUniqueFiles(prev, validFiles));
  };

  const handleRemoveFile = (removeIndex: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== removeIndex));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      appendFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      appendFiles(Array.from(e.dataTransfer.files));
    }
  };

  const clearForm = () => {
    setBatch("");
    setCustomBatch("");
    setTitle("");
    setDescription("");
    setFiles([]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resolvedBatch = batch === "Other" ? customBatch.trim() : batch;

    if (!resolvedBatch) {
      setError("Select the batch or academic year.");
      return;
    }

    if (!title.trim()) {
      setError("Enter a note title.");
      return;
    }

    if (files.length === 0) {
      setError("Add at least one PDF or Word file.");
      return;
    }

    onSubmit?.({
      title: title.trim(),
      subject,
      batch: resolvedBatch,
      description: description.trim(),
      files,
    });

    clearForm();
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Teacher upload
            </p>
            <h3 className="mt-1 text-xl font-semibold">Upload notes for your subject and A/L batch</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your subject is fixed to your teacher profile. Pick the batch, then drop in PDF or Word files.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Teacher workflow
          </Badge>
        </div>
      </div>

      <form className="space-y-6 p-5" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Teacher Specification
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            This upload is registered under your official teacher profile.
          </p>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p><strong>Name:</strong> {teacherName || 'N/A'}</p>
            <p className="flex items-center gap-1.5 mt-1">
              <strong>Assigned Subject:</strong>
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {subject}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="note-title">Note title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Algebra - Quadratic Equations"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch">Batch / academic year</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger id="batch">
                <SelectValue placeholder="Choose an A/L batch like 2026 A/L" />
              </SelectTrigger>
              <SelectContent>
                {batchOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {batch === "Other" && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="custom-batch">Custom batch</Label>
              <Input
                id="custom-batch"
                value={customBatch}
                onChange={(e) => setCustomBatch(e.target.value)}
                placeholder="Example: 2026 A/L - Advanced Level"
              />
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of what the note covers."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={fileInputId}>Upload files</Label>
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-label="Select files to upload"
            onChange={handleChange}
            className="hidden"
          />

          <button
            type="button"
            className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:bg-muted/30"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              Drag and drop PDF or Word files here, or click to choose files.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX
            </p>
          </button>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Selected files</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => setFiles([])}>
                Clear all
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="truncate">{file.name}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Keep each upload tied to one subject and one batch so students get the right materials.
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={clearForm}>
              Reset form
            </Button>
            <Button type="submit">Publish notes</Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
