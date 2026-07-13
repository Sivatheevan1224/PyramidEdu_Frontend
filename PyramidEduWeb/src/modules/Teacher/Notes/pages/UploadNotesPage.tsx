"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import * as notesApi from "../services/notes.api";

const acceptedExtensions = [".pdf", ".doc", ".docx", ".pptx", ".ppt", ".png", ".jpg", ".jpeg", ".webp"];
const acceptedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function UploadNotesPage() {
  const router = useRouter();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const assignedSubject = user?.subject ?? "Unknown";
  const assignedSubjectId = user?.subjectId ?? "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batches, setBatches] = useState<{ id: string; batchName: string }[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setBatchesLoading(true);
    api.get("/batches?activeOnly=true")
      .then((res) => {
        if (!mounted) return;
        const payload = res.data;
        if (Array.isArray(payload?.data)) {
          setBatches(payload.data);
        } else if (Array.isArray(payload)) {
          setBatches(payload);
        }
      })
      .catch((err) => console.error("Failed to load batches", err))
      .finally(() => {
        if (mounted) setBatchesLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const isAcceptedFile = (file: File) => {
    const lowerName = file.name.toLowerCase();
    return (
      acceptedExtensions.some((extension) => lowerName.endsWith(extension)) ||
      acceptedMimeTypes.has(file.type)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files);
      const valid = incoming.filter(isAcceptedFile);
      if (valid.length < incoming.length) {
        toast.error("Some files were rejected. Supported formats: PDF, DOCX, PPTX, PPT, Images");
      }
      setFiles((prev) => [...prev, ...valid]);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const incoming = Array.from(e.dataTransfer.files);
      const valid = incoming.filter(isAcceptedFile);
      if (valid.length < incoming.length) {
        toast.error("Some files were rejected. Supported formats: PDF, DOCX, PPTX, PPT, Images");
      }
      setFiles((prev) => [...prev, ...valid]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!batchName) {
      toast.error("Please select a target batch");
      return;
    }
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading study materials...");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("text", description.trim());
      formData.append("batch", batchName);
      formData.append("subjectId", assignedSubjectId);

      // Find the correct batchId from our loaded batches to associate relation if possible
      const matchedBatch = batches.find(b => b.batchName === batchName);
      if (matchedBatch) {
        formData.append("batchId", matchedBatch.id);
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      await notesApi.createNote(formData);
      toast.success("Study material published successfully!", { id: toastId });
      router.push("/teacher/notes");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to publish study material", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/teacher/notes")}
          className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Upload Notes & Materials</h1>
          <p className="text-sm text-slate-500 mt-1">Publish study guides, slides, or revision notes directly to students.</p>
        </div>
      </div>

      <Card className="p-8 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Subject Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Assigned Subject</Label>
              <Input
                value={assignedSubject}
                disabled
                className="bg-slate-50 border-slate-200 text-slate-500 rounded-xl"
              />
            </div>

            {/* Batch Select */}
            <div className="space-y-2">
              <Label className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Target Batch / Academic Year</Label>
              <Select value={batchName} onValueChange={setBatchName}>
                <SelectTrigger className="border-slate-200 rounded-xl h-10">
                  <SelectValue placeholder={batchesLoading ? "Loading batches..." : "Select Batch"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All Batches">All Batches</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.batchName}>
                      {b.batchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Title *</Label>
            <Input
              id="title"
              required
              placeholder="e.g. Organic Chemistry Part II, Physics Vectors Slide Pack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-slate-200 rounded-xl h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide a brief summary of the files included and study instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-200 rounded-xl min-h-24 resize-none"
            />
          </div>

          {/* Drag & Drop File Upload */}
          <div className="space-y-3">
            <Label className="text-xs uppercase font-extrabold tracking-wider text-slate-400 font-bold">Attached Documents & Files</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.pptx,.ppt,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Drag and drop files here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOCX, PPTX, PPT, PNG, JPG (Max 50MB per file)
                </p>
              </div>
            </div>

            {/* List of files to upload */}
            {files.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Files to Upload ({files.length})</Label>
                <div className="grid grid-cols-1 gap-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/teacher/notes")}
              className="rounded-xl h-10 border-slate-200 font-semibold cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Materials"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UploadNotesPage;
