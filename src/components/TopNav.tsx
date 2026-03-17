import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNav() {
  return (
    <header className="h-20 flex items-center justify-between px-8 relative z-50">
      {/* Floating Glass Container */}
      <div className="absolute inset-x-8 top-4 bottom-0 glass-panel border-white/5 bg-white/5 backdrop-blur-2xl flex items-center justify-between px-8 shadow-glass">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-glow-primary group cursor-pointer transition-transform hover:rotate-12">
            <span className="text-primary-foreground font-black text-xl tracking-tighter">A</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">
              AURA
            </h1>
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">LifeOS</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/5 mr-4">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">V_1.0.4</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase animate-glow">Operational</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl w-10 h-10 text-white/40 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10 cursor-pointer hover:scale-110 transition-all border-2 border-transparent hover:border-primary/50 shadow-glass">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Glowing Bottom Border */}
        <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </header>
  );
}
