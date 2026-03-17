import { DashboardCard } from "@/components/DashboardCard";
import { ConversationHistory } from "@/components/ConversationHistory";
import { AISuggestions } from "@/components/AISuggestions";
import { TopNav } from "@/components/TopNav";
import { Brain, Wallet, Heart } from "lucide-react";

const Home = () => {
  const dashboardData = {
    learn: {
      hoursStudied: 24.5,
      topicsCovered: 12,
      skillGrowth: 34,
      weeklyTrend: [65, 72, 68, 80, 85, 88, 92],
    },
    finance: {
      weeklySavings: 850,
      expenseTrend: -12,
      totalSaved: 12400,
      spendingData: [
        { name: "Mon", spending: 45, saving: 120 },
        { name: "Tue", spending: 60, saving: 100 },
        { name: "Wed", spending: 35, saving: 140 },
        { name: "Thu", spending: 80, saving: 90 },
        { name: "Fri", spending: 55, saving: 130 },
        { name: "Sat", spending: 90, saving: 80 },
        { name: "Sun", spending: 40, saving: 150 },
      ],
    },
    health: {
      moodScore: 8.2,
      steps: 8547,
      sleepHours: 7.5,
      weeklyActivity: 85,
    },
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden text-foreground">
      {/* Dynamic Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-blob w-[500px] h-[500px] -top-20 -left-20 bg-purple-600 transition-all duration-1000" />
        <div className="aurora-blob w-[600px] h-[600px] -bottom-40 -right-20 bg-pink-600 transition-all duration-1000 delay-300" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <TopNav />
        
        <main className="flex-1 px-8 py-12 lg:px-24">
          {/* Hero Section */}
          <header className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
              AURA LIFE
            </h1>
            <div className="relative inline-block px-12 py-2">
              <p className="text-xl md:text-2xl font-bold tracking-[0.4em] text-white/40 uppercase">
                Intelligence_Synthesized
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-glow" />
            </div>
          </header>

          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-[1400px] mx-auto">
            <DashboardCard
              domain="learn"
              icon={Brain}
              title="Learning_Stream"
              stats={[
                { label: "Uptime", value: `${dashboardData.learn.hoursStudied}h` },
                { label: "Nodes", value: dashboardData.learn.topicsCovered },
                { label: "Sync", value: `+${dashboardData.learn.skillGrowth}%` },
              ]}
              chartData={dashboardData.learn.weeklyTrend}
              chartType="line"
            />
            
            <DashboardCard
              domain="finance"
              icon={Wallet}
              title="Capital_Buffer"
              stats={[
                { label: "Inflow", value: `$${dashboardData.finance.weeklySavings}` },
                { label: "Delta", value: `${dashboardData.finance.expenseTrend}%` },
                { label: "Total", value: `$${dashboardData.finance.totalSaved.toLocaleString()}` },
              ]}
              chartData={dashboardData.finance.spendingData}
              chartType="bar"
            />
            
            <DashboardCard
              domain="health"
              icon={Heart}
              title="Vital_Signals"
              stats={[
                { label: "Vibe", value: `${dashboardData.health.moodScore}/10` },
                { label: "Kinetic", value: dashboardData.health.steps.toLocaleString() },
                { label: "Reset", value: `${dashboardData.health.sleepHours}h` },
              ]}
              chartData={dashboardData.health.weeklyActivity}
              chartType="radial"
            />
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto mb-16">
            <ConversationHistory />
            <AISuggestions />
          </div>

          {/* Footer */}
          <footer className="text-center py-12 border-t border-white/5 bg-white/5 backdrop-blur-xl rounded-t-[4rem] mx-4 lg:mx-24">
            <p className="text-xs font-black tracking-[0.5em] text-white/20 uppercase">
              Operational_Environment_V1.0.4_Aura
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;
