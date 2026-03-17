import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Sparkles } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  summary: string;
  timestamp: Date;
}

export function TopicSummarizer() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicName, setTopicName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSummarize = async () => {
    if (!topicName.trim()) return;

    setIsGenerating(true);

    // Simulate AI summary generation
    setTimeout(() => {
      const newTopic: Topic = {
        id: Date.now().toString(),
        name: topicName,
        summary: `Aura analysis complete for ${topicName}. Data points synthesized into coherent knowledge structures.`,
        timestamp: new Date(),
      };

      setTopics([newTopic, ...topics]);
      setTopicName("");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="glass-panel border-white/5 p-8 space-y-6 bg-white/5 backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 text-white uppercase">
          <FileText className="w-6 h-6 text-blue-500 shadow-glow-primary" />
          AURA_SYNTHESIZER
        </h3>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 tracking-widest uppercase animate-pulse">
          Synthesis_Mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="space-y-4">
          <div className="relative group/input">
            <Input
              placeholder="TARGET_TOPIC"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSummarize()}
              className="bg-black/20 border-white/10 h-12 px-6 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-white/20 text-sm font-bold tracking-tight"
            />
          </div>
          <Button
            onClick={handleSummarize}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all scale-100 active:scale-95 disabled:opacity-50"
            disabled={!topicName.trim() || isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Begin_Synthesis
              </div>
            )}
          </Button>
        </div>

        <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-2xl h-[200px] md:h-auto overflow-hidden">
          <ScrollArea className="h-full pr-4 custom-scrollbar">
            {topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-20">
                <FileText className="w-12 h-12 mb-4 animate-pulse" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Waiting_For_Subject...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all animate-fade-in group/item"
                  >
                    <h4 className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {topic.name}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed font-medium line-clamp-3">
                      {topic.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between opacity-30 text-[8px] font-bold tracking-widest uppercase">
                      <span>{topic.timestamp.toLocaleDateString()}</span>
                      <span className="text-blue-400">Verified_Data</span>
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
