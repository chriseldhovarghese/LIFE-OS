import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, TrendingUp, Target, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  icon: typeof Sparkles;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const priorityStyles = {
  high: "border-health-from/30 bg-health-from/5",
  medium: "border-learn-from/30 bg-learn-from/5",
  low: "border-finance-from/30 bg-finance-from/5",
};

export function AISuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  return (
    <Card className="glass-panel border-white/5 h-[400px] flex flex-col animate-fade-in bg-white/5 backdrop-blur-2xl overflow-hidden group">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary shadow-glow-primary animate-glow" />
            <CardTitle className="text-xl font-black tracking-tighter text-white uppercase">AURA_INSIGHTS</CardTitle>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 tracking-widest uppercase">
            Realtime_Stream
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 relative z-10">
        <ScrollArea className="h-full px-6 custom-scrollbar">
          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-20 scale-90">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                <Sparkles className="w-16 h-16 text-primary relative z-10" />
              </div>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white mb-2">Analyzing_Life_Patterns...</p>
              <p className="text-[8px] font-medium tracking-widest text-white/60 uppercase">System requires more data points for synthesis</p>
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;

                return (
                  <div
                    key={suggestion.id}
                    className={cn(
                      "group p-5 rounded-2xl border border-white/5",
                      "bg-white/5 backdrop-blur-md transition-all duration-500 cursor-pointer",
                      "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] shadow-glass animate-fade-in"
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold tracking-tight text-white group-hover:text-primary transition-colors">{suggestion.title}</h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border",
                              suggestion.priority === "high" && "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
                              suggestion.priority === "medium" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                              suggestion.priority === "low" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            )}
                          >
                            {suggestion.priority}_PRIORITY
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </Card>
  );
}
