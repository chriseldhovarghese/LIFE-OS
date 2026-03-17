import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Domain = "learn" | "finance" | "health" | "general";

interface VoiceCallProps {
  currentDomain: Domain;
}

export function VoiceCall({ currentDomain }: VoiceCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

  const handleStartCall = () => {
    setIsCallActive(true);
    toast({
      title: "NEURAL_LINK_ESTABLISHED",
      description: "Aura is now monitoring audio stream...",
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    toast({
      title: "LINK_TERMINATED",
      description: "Audio processing offline.",
    });
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center gap-4 z-50 animate-fade-in">
      {isCallActive && (
        <div className="absolute -inset-4 bg-primary/20 blur-3xl animate-pulse rounded-full" />
      )}
      
      {isCallActive && (
        <Button
          onClick={() => setIsMuted(!isMuted)}
          size="icon"
          variant="ghost"
          className={cn(
            "rounded-2xl w-12 h-12 glass-panel border-white/10 transition-all duration-500 hover:scale-110 relative z-10",
            isMuted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"
          )}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      )}

      <Button
        onClick={isCallActive ? handleEndCall : handleStartCall}
        size="icon"
        className={cn(
          "rounded-[2rem] w-16 h-16 transition-all duration-500 hover:scale-110 relative z-10 shadow-glass border border-white/10 group",
          isCallActive
            ? "bg-red-600 hover:bg-red-500 shadow-red-500/40"
            : "bg-primary hover:bg-primary/80 shadow-glow-primary"
        )}
      >
        {isCallActive ? (
          <PhoneOff className="w-7 h-7 text-white animate-pulse" />
        ) : (
          <div className="relative">
            <Phone className="w-7 h-7 text-primary-foreground group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </Button>
      
      {isCallActive && (
        <div className="flex gap-1 h-4 items-center">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-primary rounded-full animate-bounce shadow-glow-primary"
              style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
