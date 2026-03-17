import { LucideIcon, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Progress } from "@/components/ui/progress";

type Domain = "learn" | "finance" | "health";

interface Stat {
  label: string;
  value: string | number;
}

interface DashboardCardProps {
  domain: Domain;
  icon: LucideIcon;
  title: string;
  stats: Stat[];
  chartData: any;
  chartType: "line" | "bar" | "radial";
}

export function DashboardCard({
  domain,
  icon: Icon,
  title,
  stats,
  chartData,
  chartType,
}: DashboardCardProps) {
  const domainStyles = {
    learn: "gradient-learn",
    finance: "gradient-finance",
    health: "gradient-health",
  };

  const domainGradients = {
    learn: "from-learn-from to-learn-to",
    finance: "from-finance-from to-finance-to",
    health: "from-health-from to-health-to",
  };

  const hasData = stats.length > 0;

  const renderChart = () => {
    if (!hasData) return null;

    if (chartType === "line" && Array.isArray(chartData)) {
      const data = chartData.map((value, index) => ({
        day: index + 1,
        value,
      }));
      return (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "bar" && Array.isArray(chartData)) {
      return (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <Bar dataKey="saving" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spending" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "radial" && typeof chartData === "number") {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="relative w-32 h-32">
            <Progress value={chartData} className="h-32 w-32" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold">{chartData}%</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      className={cn(
        "glass-card border-white/5 group hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden",
        "shadow-glass hover:shadow-glow-primary/20"
      )}
    >
      {/* Glow Effect */}
      <div
        className={cn(
          "absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl -z-10",
          domain === "learn" && "bg-blue-500",
          domain === "finance" && "bg-emerald-500",
          domain === "health" && "bg-red-500"
        )}
      />

      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10",
              domainStyles[domain]
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter border border-white/10 bg-white/5",
              "text-white/80 uppercase"
            )}
          >
            {domain}
          </div>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-white/90">{title}</CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4 pt-0">
        {hasData ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</p>
                  <p className="text-base font-bold text-white/90">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 opacity-80">{renderChart()}</div>
          </>
        ) : (
          <div className="text-center text-white/20 py-8">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs">No Data Stream</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
