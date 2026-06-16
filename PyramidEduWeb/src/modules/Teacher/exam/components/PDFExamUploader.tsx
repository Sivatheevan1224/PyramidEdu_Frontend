import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadExamFile } from '../services/exam.api';

interface PDFExamUploaderProps {
  onUploadSuccess: (fileUrl: string) => void;
}

export const PDFExamUploader: React.FC<PDFExamUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const publicUrl = await uploadExamFile(file, 'essay-pdfs');
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to upload PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Upload Exam PDF Sheet</h4>
            <p className="text-xs text-slate-505 mt-1">Select or drop the essay question paper PDF (max 5MB)</p>
          </div>

          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <Button type="button" variant="outline" className="text-xs h-9 font-semibold">
              Select Questionnaire PDF
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border dark:border-slate-700 p-2.5 rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()}>
              <FileText className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                {file.name}
              </span>
              <Button 
                size="sm" 
                onClick={handleUpload} 
                disabled={isUploading}
                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold"
              >
                {isUploading ? 'Uploading...' : 'Confirm'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};
