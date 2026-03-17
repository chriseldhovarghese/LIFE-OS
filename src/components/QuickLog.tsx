import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Plus } from "lucide-react";

interface HealthLog {
  id: string;
  type: string;
  value: string;
  timestamp: Date;
}

export function QuickLog() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [logType, setLogType] = useState("");
  const [logValue, setLogValue] = useState("");

  const handleLog = () => {
    if (!logType.trim() || !logValue.trim()) return;

    const newLog: HealthLog = {
      id: Date.now().toString(),
      type: logType,
      value: logValue,
      timestamp: new Date(),
    };

    setLogs([newLog, ...logs]);
    setLogType("");
    setLogValue("");
  };

  return (
    <Card className="glass-panel border-white/5 p-8 space-y-6 bg-white/5 backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-3xl rounded-full group-hover:bg-red-600/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 text-white uppercase">
          <Activity className="w-6 h-6 text-red-500 shadow-glow-primary" />
          AURA_HEALTH_STREAM
        </h3>
        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 tracking-widest uppercase animate-pulse">
          Live_Log
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="space-y-4">
          <div className="relative group/input">
            <Input
              placeholder="METRIC_TYPE (e.g. HeartRate, Steps)"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="bg-black/20 border-white/10 h-12 px-6 rounded-2xl focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-white/20 text-sm font-bold tracking-tight"
            />
          </div>
          <div className="relative group/input">
            <Input
              placeholder="VALUE_DATA"
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLog()}
              className="bg-black/20 border-white/10 h-12 px-6 rounded-2xl focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-white/20 text-sm font-bold tracking-tight"
            />
          </div>
          <Button
            onClick={handleLog}
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all scale-100 active:scale-95"
            disabled={!logType.trim() || !logValue.trim()}
          >
            <Plus className="w-5 h-5 mr-2" />
            Inject_Log
          </Button>
        </div>

        <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-2xl h-[200px] md:h-auto overflow-hidden">
          <ScrollArea className="h-full pr-4 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-20">
                <Activity className="w-12 h-12 mb-4 animate-pulse" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Waiting_For_Input...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all animate-fade-in group/item"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase group-hover/item:text-red-400 transition-colors">{log.type}</h4>
                      <span className="text-sm font-black text-white group-hover/item:scale-110 transition-transform">
                        {log.value}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-red-500/40 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
