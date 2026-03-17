
import { useState, useEffect } from "react";
import { Mic, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/lib/api-config";

type Domain = "learn" | "finance" | "health" | "general";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  currentDomain: Domain;
}

export function ChatInterface({ currentDomain }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("123");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: `Aura ${currentDomain} active. How can I assist you?`,
        timestamp: new Date(),
      },
    ]);
  }, [currentDomain]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Parallel: Store memory and get chat response
      const [saveRes, chatRes] = await Promise.all([
        fetch(API_ENDPOINTS.MEMORY(currentDomain), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, content: currentQuery }),
        }),
        fetch(API_ENDPOINTS.CHAT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, query: currentQuery }),
        })
      ]);

      if (!chatRes.ok) throw new Error("Chat failed");
      const data = await chatRes.json();

      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "System synchronization error. Please retry.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 glass-panel border-white/5 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in items-end gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-5 py-3 rounded-2xl transition-all duration-300",
                message.role === "user"
                  ? "bg-primary text-primary-foreground shadow-glow-primary rounded-br-none"
                  : "bg-white/5 border border-white/10 backdrop-blur-md rounded-bl-none hover:bg-white/10"
              )}
            >
              <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2 opacity-50 text-[10px]">
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-white/40 hover:text-white hover:bg-white/10"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative group">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Aura..."
              className="bg-black/20 border-white/10 h-12 px-6 rounded-full focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/20"
            />
            <div className="absolute inset-0 rounded-full border border-primary/20 opacity-0 group-focus-within:opacity-100 animate-glow pointer-events-none" />
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className={cn(
              "rounded-full h-12 w-12 transition-all hover:scale-110",
              currentDomain === "learn" && "bg-blue-600 shadow-blue-500/20",
              currentDomain === "finance" && "bg-emerald-600 shadow-emerald-500/20",
              currentDomain === "health" && "bg-red-600 shadow-red-500/20",
              currentDomain === "general" && "bg-primary shadow-primary/20"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
