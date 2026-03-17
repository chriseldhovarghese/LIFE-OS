import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Wallet, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Domain = "learn" | "finance" | "health";

interface Conversation {
  id: string;
  domain: Domain;
  preview: string;
  timestamp: string;
}

const domainConfig = {
  learn: {
    icon: Brain,
    color: "text-learn-from",
    bg: "bg-learn-from/10",
  },
  finance: {
    icon: Wallet,
    color: "text-finance-from",
    bg: "bg-finance-from/10",
  },
  health: {
    icon: Heart,
    color: "text-health-from",
    bg: "bg-health-from/10",
  },
};

export function ConversationHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  return (
    <Card className="glass-panel border-white/5 h-[400px] flex flex-col animate-fade-in bg-white/5 backdrop-blur-2xl overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary shadow-glow-primary" />
            <CardTitle className="text-xl font-black tracking-tighter text-white uppercase">RECALL_LOGS</CardTitle>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 tracking-widest uppercase">
            Data_Buffer
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 relative z-10">
        <ScrollArea className="h-full px-6 custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-20 scale-90">
              <Brain className="w-16 h-16 mb-4 animate-pulse" />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white mb-2">Neural_Buffer_Empty</p>
              <p className="text-[8px] font-medium tracking-widest text-white/60 uppercase">Initialize interaction to populate logs</p>
            </div>
          ) : (
            <div className="space-y-3 pb-8">
              {conversations.map((conversation, index) => {
                const config = domainConfig[conversation.domain];
                const Icon = config.icon;

                return (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group p-4 rounded-2xl border border-white/5",
                      "bg-white/5 backdrop-blur-md transition-all duration-500 cursor-pointer",
                      "hover:bg-white/10 hover:border-white/20 hover:translate-x-2 animate-fade-in shadow-glass"
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl border border-white/5", config.bg)}>
                        <Icon className={cn("w-5 h-5 shadow-glow-primary", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-1 tracking-tight">
                          {conversation.preview}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">{conversation.domain}</span>
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[8px] font-medium tracking-widest text-white/40 uppercase">
                            {conversation.timestamp}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
