
import React from 'react';
import { Icons } from '../constants';

interface FileUploadProps {
  label: string;
  id: string;
  accept?: string;
  onChange: (file: File | null) => void;
  selectedFile: File | null;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, id, accept, onChange, selectedFile, required }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="flex flex-col gap-3 flex-1">
      <label htmlFor={id} className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className={`relative group border rounded-2xl p-5 transition-all cursor-pointer ${
        selectedFile 
        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-inner' 
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600'
      }`}>
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={`Upload ${label}`}
        />
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            selectedFile ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 dark:group-hover:text-blue-400'
          }`}>
            <Icons.Upload />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {selectedFile ? selectedFile.name : `Attach ${label}`}
            </p>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, DOCX'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
