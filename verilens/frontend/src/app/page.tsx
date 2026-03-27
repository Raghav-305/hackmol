"use client"

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResult } from '@/components/AnalysisResult';
import { IndicatorExplanation } from '@/components/IndicatorExplanation';
import { analyzeImage, AnalysisResponse } from '@/app/lib/api';
import { useFirestore, useUser, useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const storage = useStorage();

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisData = await analyzeImage(file);
      setResult(analysisData);

      if (user && db && storage) {
        const fileRef = ref(storage, `scans/${user.uid}/${Date.now()}-${file.name}`);
        
        // Upload and save metadata
        uploadBytes(fileRef, file).then(async (snapshot) => {
          const downloadUrl = await getDownloadURL(snapshot.ref);
          
          addDoc(collection(db, 'scans'), {
            userId: user.uid,
            filename: file.name,
            imageUrl: downloadUrl,
            result: analysisData.ai_detection.result,
            confidence: analysisData.ai_detection.confidence,
            status: analysisData.final_status,
            timestamp: serverTimestamp(),
          });
        }).catch((err) => {
          console.error("Storage upload failed", err);
        });
      }
    } catch (error) {
      console.error("Workflow failed", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Something went wrong while processing the image. Our servers might be under heavy load.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      
      <div className="container mx-auto px-6 py-16 md:py-24">
        <header className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
            Powered by Advanced Neural Verification
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight text-foreground animate-in fade-in slide-in-from-top-6 duration-700">
            Uncover Truth with <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">VeriLens</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-1000 leading-relaxed">
            Professional-grade digital forensic tool for identifying image manipulation, deepfakes, and pixel inconsistencies.
          </p>
        </header>

        <section className="relative z-10 space-y-20">
          <ImageUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          {result && <AnalysisResult result={result} />}
          <IndicatorExplanation />
        </section>

        <footer className="mt-32 py-12 border-t border-white/5 text-center">
          <p className="text-muted-foreground text-sm font-medium">© {new Date().getFullYear()} VeriLens Forensic Intelligence. Enterprise Security Suite.</p>
        </footer>
      </div>
      <Toaster />
    </main>
  );
}
