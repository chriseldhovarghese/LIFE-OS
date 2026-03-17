
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
  const [userId, setUserId] = useState("123"); // Hardcoded user ID for demonstration

  useEffect(() => {
    // Initial message when the component mounts or the domain changes
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: `Hello! I'm your ${
          currentDomain === "learn"
            ? "learning companion"
            : currentDomain === "finance"
            ? "financial advisor"
            : "wellness coach"
        }. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
  }, [currentDomain]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      // Send user message to the backend to be stored
      await fetch(API_ENDPOINTS.MEMORY(currentDomain), {
        method: "POST",
        mode: "cors",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          content: inputValue,
        }),
      });

      // Get AI response from the backend
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          query: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the backend.");
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: `Starting a new conversation. I'm ready to help with your ${currentDomain} goals!`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Domain indicator */}
      <div
        className={cn(
          "h-1 transition-all duration-500",
          currentDomain === "learn" && "gradient-learn",
          currentDomain === "finance" && "gradient-finance",
          currentDomain === "health" && "gradient-health"
        )}
      />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 backdrop-blur-lg",
                message.role === "user"
                  ? "bg-white/10 border border-white/20 text-foreground"
                  : cn(
                      "border border-white/10",
                      currentDomain === "learn" && "bg-blue-500/10",
                      currentDomain === "finance" && "bg-emerald-500/10",
                      currentDomain === "health" && "bg-red-500/10"
                    )
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 glass-panel border-t border-white/10">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleNewChat}
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-white/10 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex items-center gap-2 glass-panel px-4 py-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask LIFEOS anything…"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-white/10 flex-shrink-0"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            size="icon"
            className={cn(
              "rounded-full flex-shrink-0 transition-all hover:scale-105",
              currentDomain === "learn" && "gradient-learn",
              currentDomain === "finance" && "gradient-finance",
              currentDomain === "health" && "gradient-health"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
