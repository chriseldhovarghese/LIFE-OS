import { TrendingUp, Target, Activity, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Domain = "learn" | "finance" | "health" | "general";

interface ContextPanelProps {
  currentDomain: Domain;
  isOpen: boolean;
  onToggle: () => void;
}

export function ContextPanel({ currentDomain, isOpen, onToggle }: ContextPanelProps) {
  const { toast } = useToast();

  return (
    <>
      {/* Panel */}
      <aside
        className={cn(
          "fixed lg:relative right-0 top-0 h-full w-80 glass-panel border-white/5 p-8 flex-shrink-0 transition-all duration-500 z-40 bg-white/5 backdrop-blur-3xl overflow-hidden group",
          !isOpen && "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />

        {/* Header */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black tracking-tighter text-white uppercase">
              {currentDomain === "general" ? "GLOBAL_STATS" : `${currentDomain}_STREAM`}
            </h3>
            <div className="w-2 h-2 rounded-full bg-primary animate-glow shadow-glow-primary" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
            HEURISTIC_ANALYSIS_V2
          </p>
        </div>

        {/* Insights */}
        <div className="space-y-6 relative z-10">
          <div className="glass-panel border-white/5 bg-black/20 p-6 rounded-2xl text-center border-dashed">
            <TrendingUp className="w-8 h-8 mx-auto mb-4 text-white/10" />
            <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Awaiting_Data_Ingestion...</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">
              <span>SYNC_STRENGTH</span>
              <span>0%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary/20 w-0 transition-all duration-1000" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-auto space-y-3 relative z-10">
          <Button
            variant="outline"
            className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all"
            onClick={() => toast({ description: "Access Denied: Insufficient Data" })}
          >
            DEEP_ANALYTICS
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all"
            onClick={() => toast({ description: "Buffer Empty" })}
          >
            EXPORT_BUFFER
          </Button>
        </div>
        
        {/* Glow Line */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </aside>

      {/* Backdrop overlay - mobile only */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
        />
      )}
    </>
  );
}
