"use client"

import { useState, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export function ImageUpload({ onFileSelect, isAnalyzing }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {preview ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden glass-morphism border-2 border-primary/30 group animate-in fade-in zoom-in duration-300">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain p-4 transition-all"
          />
          
          {isAnalyzing && (
            <>
              <div className="scan-line" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xl font-bold text-white tracking-tight">Processing Forensic Data</p>
                  <p className="text-sm text-primary/80 animate-pulse uppercase tracking-[0.2em]">Neural Verification Active</p>
                </div>
              </div>
            </>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             {!isAnalyzing && (
               <Button 
                 variant="destructive" 
                 size="icon" 
                 onClick={clearFile}
                 className="rounded-full shadow-2xl"
               >
                 <X className="w-5 h-5" />
               </Button>
             )}
          </div>
        </div>
      ) : (
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
            dragActive 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="bg-primary/20 p-6 rounded-full mb-6 border border-primary/30 shadow-[0_0_30px_rgba(0,102,221,0.2)]">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <p className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              Drop image here or <span className="text-primary underline underline-offset-4 decoration-primary/30">browse</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Analyze PNG, JPG or WebP images up to 10MB for manipulation indicators.
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
        </label>
      )}
    </div>
  );
}
