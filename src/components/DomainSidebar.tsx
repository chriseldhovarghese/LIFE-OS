import { Brain, DollarSign, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Domain = "learn" | "finance" | "health" | "general";

interface DomainSidebarProps {
  currentDomain: Domain;
  onDomainChange: (domain: Domain) => void;
}

const domains = [
  {
    id: "general" as Domain,
    name: "General AI",
    icon: Sparkles,
    description: "All Domains",
  },
  {
    id: "learn" as Domain,
    name: "Learn",
    icon: Brain,
    description: "Education & Growth",
  },
  {
    id: "finance" as Domain,
    name: "Finance",
    icon: DollarSign,
    description: "Money & Wealth",
  },
  {
    id: "health" as Domain,
    name: "Health",
    icon: Heart,
    description: "Mind & Wellness",
  },
];

export function DomainSidebar({ currentDomain, onDomainChange }: DomainSidebarProps) {
  return (
    <aside className="w-24 lg:w-72 glass-panel border-white/5 flex-shrink-0 p-6 flex flex-col gap-6 animate-fade-in overflow-hidden">
      <div className="flex flex-col gap-4">
        {domains.map((domain) => {
          const isActive = currentDomain === domain.id;
          const Icon = domain.icon;
          
          return (
            <button
              key={domain.id}
              onClick={() => onDomainChange(domain.id)}
              className={cn(
                "relative group rounded-2xl p-4 transition-all duration-500",
                "flex flex-col lg:flex-row items-center lg:items-center gap-4",
                isActive ? "bg-white/10 shadow-glass border border-white/10" : "hover:bg-white/5"
              )}
            >
              {/* Icon with gradient background */}
              <div className={cn(
                "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                isActive ? "bg-primary text-primary-foreground shadow-glow-primary scale-110" : "bg-white/5 text-white/40 group-hover:text-white/80"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Text - hidden on mobile */}
              <div className="hidden lg:flex flex-col items-start text-left flex-1 relative z-10 overflow-hidden">
                <span className={cn(
                  "font-bold text-sm tracking-tight transition-all duration-500 uppercase",
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
                )}>
                  {domain.name}
                </span>
                <span className="text-[10px] text-white/20 font-medium tracking-widest uppercase">
                  {domain.id}
                </span>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 w-1.5 h-10 bg-primary rounded-r-full shadow-glow-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="hidden lg:block glass-panel p-4 bg-white/5 border-white/5">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-3 font-bold">System Status</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-white/60 tracking-widest">AURA_SYNCED</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
