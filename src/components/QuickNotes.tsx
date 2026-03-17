import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Save, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      timestamp: new Date(),
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <Card className="glass-panel border-white/5 p-8 space-y-6 bg-white/5 backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 text-white uppercase">
          <Plus className="w-6 h-6 text-blue-500 shadow-glow-primary" />
          AURA_KNOWLEDGE_BASE
        </h3>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 tracking-widest uppercase animate-pulse">
          Active_Node
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="space-y-4">
          <Input
            placeholder="NODE_TITLE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/20 border-white/10 h-12 px-6 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-white/20 text-sm font-bold tracking-tight"
          />
          <Textarea
            placeholder="ENCODE_DATA_HERE..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-black/20 border-white/10 px-6 py-4 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-white/20 text-sm font-bold tracking-tight min-h-[120px]"
          />
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all scale-100 active:scale-95"
            disabled={!title.trim() || !content.trim()}
          >
            <Save className="w-5 h-5 mr-2" />
            Commit_Node
          </Button>
        </div>

        <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-2xl h-[240px] md:h-auto overflow-hidden">
          <ScrollArea className="h-full pr-4 custom-scrollbar">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-20">
                <Plus className="w-12 h-12 mb-4 animate-pulse" />
                <p className="text-[10px] font-bold tracking-widest uppercase">Waiting_For_Nodes...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all animate-fade-in group/item"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase group-hover/item:text-blue-400 transition-colors line-clamp-1">{note.title}</h4>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(note.id)}
                        className="h-6 w-6 text-white/20 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-medium">
                      {note.content}
                    </p>
                    <div className="mt-3 flex items-center justify-between opacity-30 text-[8px] font-bold tracking-widest">
                      <span>{note.timestamp.toLocaleDateString()}</span>
                      <span>NODE_HASH_{note.id.slice(-4)}</span>
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
