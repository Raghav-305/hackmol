"use client"

import { useState } from 'react';
import { aiDeepfakeIndicatorExplanation } from '@/ai/flows/ai-deepfake-indicator-explanation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, Loader2, Info } from 'lucide-react';

export function IndicatorExplanation() {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const result = await aiDeepfakeIndicatorExplanation(query || "");
      setExplanation(result.explanation);
    } catch (error) {
      console.error("AI explanation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-20 animate-in slide-in-from-bottom-12 duration-700">
      <Card className="glass-morphism border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-secondary" />
            AI Forensics Assistant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask about specific deepfake indicators like "facial features", "lighting", or "edges".
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleExplain} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. How are facial inconsistencies detected?"
              className="glass-morphism border-white/10"
            />
            <Button type="submit" disabled={loading} className="shrink-0 bg-secondary hover:bg-secondary/80">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>

          {explanation && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Expert Analysis</span>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          )}
          
          {!explanation && !loading && (
            <div className="flex flex-wrap gap-2 pt-2">
              {["Lighting inconsistencies", "Skin texture", "Artifacts"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); handleExplain(); }}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-muted-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
