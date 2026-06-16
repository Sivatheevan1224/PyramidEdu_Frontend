import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssignmentUploaderProps {
  onUploadSuccess: (fileUrl: string) => void;
}

export const AssignmentUploader: React.FC<AssignmentUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    // Simulated upload
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess(`/uploads/mock-${file.name}`);
    }, 2000);
  };

  return (
    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
          <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Upload Assignment PDF</h4>
          <p className="text-sm text-slate-500 mt-1">Drag and drop or click to select file</p>
        </div>

        <input
          type="file"
          accept=".pdf"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <label htmlFor="file-upload">
            <Button asChild variant="outline" className="cursor-pointer">
              <span>Select File</span>
            </Button>
          </label>
        ) : (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-lg shadow-sm">
            <FileText className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
              {file.name}
            </span>
            <Button 
              size="sm" 
              onClick={handleUpload} 
              disabled={isUploading}
              className="ml-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
