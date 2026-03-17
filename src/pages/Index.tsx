import { useState } from "react";
import { DomainSidebar } from "@/components/DomainSidebar";
import { TopNav } from "@/components/TopNav";
import { ChatInterface } from "@/components/ChatInterface";
import { ContextPanel } from "@/components/ContextPanel";
import { DashboardCard } from "@/components/DashboardCard";
import { ConversationHistory } from "@/components/ConversationHistory";
import { AISuggestions } from "@/components/AISuggestions";
import { QuickNotes } from "@/components/QuickNotes";
import { TopicSummarizer } from "@/components/TopicSummarizer";
import { QuickLog } from "@/components/QuickLog";
import { VoiceCall } from "@/components/VoiceCall";
import { Brain, Wallet, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Domain = "learn" | "finance" | "health" | "general";

const Index = () => {
  const [currentDomain, setCurrentDomain] = useState<Domain>("general");
  const [isPanelOpen, setIsPanelOpen] = useState(false);


  return (
    <div className="min-h-screen flex flex-col overflow-hidden text-foreground">
      {/* Dynamic Aurora Background */}
      <div className="aurora-container">
        <div
          className={cn(
            "aurora-blob w-[500px] h-[500px] -top-20 -left-20 transition-colors duration-1000",
            currentDomain === "learn" && "bg-blue-600",
            currentDomain === "finance" && "bg-emerald-600",
            currentDomain === "health" && "bg-red-600",
            currentDomain === "general" && "bg-purple-600"
          )}
        />
        <div
          className={cn(
            "aurora-blob w-[600px] h-[600px] -bottom-40 -right-20 transition-colors duration-1000 delay-300",
            currentDomain === "learn" && "bg-indigo-600",
            currentDomain === "finance" && "bg-teal-600",
            currentDomain === "health" && "bg-orange-600",
            currentDomain === "general" && "bg-pink-600"
          )}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <TopNav />
        
        <main className="flex flex-1 gap-6 p-6 overflow-hidden">
          <DomainSidebar
            currentDomain={currentDomain}
            onDomainChange={setCurrentDomain}
          />
          
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {currentDomain === "general" ? (
              <div className="flex-1 overflow-y-auto pr-2 space-y-8 animate-fade-in custom-scrollbar">
                {/* Hero Header */}
                <div className="text-center py-8">
                  <h2 className="text-5xl font-bold mb-4 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    AURA LIFE
                  </h2>
                  <div className="relative inline-block px-8">
                    <p className="text-xl font-light tracking-widest text-white/60 uppercase">
                      Intelligent Living
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-glow" />
                  </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DashboardCard
                        domain="learn"
                        icon={Brain}
                        title="Learning"
                        stats={[{ label: "Topics", value: "12" }, { label: "Hours", value: "48" }, { label: "Focus", value: "92%" }]}
                        chartData={[10, 20, 15, 30, 25, 40]}
                        chartType="line"
                      />
                      <DashboardCard
                        domain="finance"
                        icon={Wallet}
                        title="Finance"
                        stats={[{ label: "Savings", value: "$2.4k" }, { label: "Growth", value: "+12%" }, { label: "Budget", value: "On Track" }]}
                        chartData={[{ name: "A", saving: 400, spending: 240 }, { name: "B", saving: 300, spending: 139 }]}
                        chartType="bar"
                      />
                    </div>
                    <ChatInterface currentDomain={currentDomain} />
                  </div>
                  
                  <div className="space-y-6">
                    <DashboardCard
                      domain="health"
                      icon={Heart}
                      title="Wellness"
                      stats={[{ label: "Sleep", value: "7.5h" }, { label: "Steps", value: "8.4k" }, { label: "Vibe", value: "Peak" }]}
                      chartData={85}
                      chartType="radial"
                    />
                    <AISuggestions />
                    <ConversationHistory />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6 overflow-hidden animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-1/3">
                  {currentDomain === "learn" && (
                    <>
                      <QuickNotes />
                      <TopicSummarizer />
                    </>
                  )}
                  {currentDomain === "health" && (
                    <QuickLog />
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  <ChatInterface currentDomain={currentDomain} />
                </div>
              </div>
            )}
          </div>
          
          <ContextPanel
            currentDomain={currentDomain}
            isOpen={isPanelOpen}
            onToggle={() => setIsPanelOpen(!isPanelOpen)}
          />
        </main>

        <VoiceCall currentDomain={currentDomain} />
      </div>
    </div>
  );
};

export default Index;
