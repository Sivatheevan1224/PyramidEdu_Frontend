import React, { useState } from 'react';
import { UploadCloud, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PDFExamUploaderProps {
  onUploadSuccess: (fileUrl: string, instructions: string) => void;
}

export const PDFExamUploader: React.FC<PDFExamUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate FileUpload API
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess(`/uploads/exams/pdf-${Date.now()}-${file.name}`, instructions);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Upload Exam PDF Sheet</h4>
            <p className="text-xs text-slate-500 mt-1">Select the complete questionnaire PDF file (max 10MB)</p>
          </div>

          <input
            type="file"
            accept="application/pdf"
            id="pdf-exam-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <label htmlFor="pdf-exam-upload">
              <Button asChild variant="outline" className="cursor-pointer text-xs h-9">
                <span>Select Questionnaire PDF</span>
              </Button>
            </label>
          ) : (
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border dark:border-slate-700 p-2.5 rounded-lg shadow-sm">
              <FileText className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                {file.name}
              </span>
              <Button 
                size="sm" 
                onClick={handleUpload} 
                disabled={isUploading}
                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                {isUploading ? 'Uploading...' : 'Confirm'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Exam Instructions</label>
        <Textarea
          placeholder="Enter custom instructions for students attempting this PDF paper..."
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="text-sm border-slate-200 dark:border-slate-800"
        />
      </div>
    </div>
  );
};
