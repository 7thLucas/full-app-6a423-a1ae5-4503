import { redirect } from "@react-router/node";
import type { LoaderFunctionArgs } from "@react-router/node";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { SpeakUpSidebar } from "~/components/speakup/sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

function MetricCard({ icon, label, value, change, positive }: {
  icon: string; label: string; value: string; change: string; positive: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
          {change}
        </span>
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function ProgressPage() {
  const { config } = useConfigurables();
  const levels = config?.proficiencyLevels ?? ["Beginner", "Intermediate", "Advanced"];
  const currentLevel = "Intermediate";
  const currentLevelIndex = levels.indexOf(currentLevel);
  const levelProgress = 65;

  const weeklyData = [
    { week: "Week 1", pronunciation: 58, grammar: 65, vocab: 80 },
    { week: "Week 2", pronunciation: 62, grammar: 70, vocab: 94 },
    { week: "Week 3", pronunciation: 70, grammar: 76, vocab: 112 },
    { week: "Week 4", pronunciation: 78, grammar: 84, vocab: 142 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">Progress Tracking</h1>
          <p className="text-sm text-muted-foreground">Your learning journey at a glance</p>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Level Progress */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Current Level</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {currentLevel[0]}
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{currentLevel}</p>
                <p className="text-sm text-muted-foreground">{levelProgress}% toward Advanced</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {levels.map((level, i) => (
                <div key={level} className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${i <= currentLevelIndex ? "bg-primary" : "bg-muted"}`} />
                    <span className="text-xs text-muted-foreground">{level}</span>
                  </div>
                  {i < levels.length - 1 && (
                    <div className="h-1 bg-muted rounded-full ml-1.5">
                      <div
                        className="h-1 bg-primary rounded-full"
                        style={{ width: i < currentLevelIndex ? "100%" : i === currentLevelIndex ? `${levelProgress}%` : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon="🔥" label="Current Streak" value="7 days" change="+2" positive />
            <MetricCard icon="🎯" label="Pronunciation" value="78%" change="+12%" positive />
            <MetricCard icon="✏️" label="Grammar Score" value="84%" change="+19%" positive />
            <MetricCard icon="📚" label="Words Learned" value="142" change="+62" positive />
          </div>

          {/* Weekly Trend Table */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Weekly Progress</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Period</th>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Pronunciation</th>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Grammar</th>
                    <th className="text-left text-muted-foreground font-medium py-2">Vocabulary</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 text-foreground font-medium">{row.week}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${row.pronunciation}%` }} />
                          </div>
                          <span className="text-foreground">{row.pronunciation}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${row.grammar}%` }} />
                          </div>
                          <span className="text-foreground">{row.grammar}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-foreground">{row.vocab} words</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span>🤖</span> AI Insights
            </h2>
            <ul className="space-y-3">
              {[
                "Your pronunciation has improved 12% this month — great consistency!",
                "You often struggle with third-person singular verbs (e.g., 'he go' vs 'he goes'). Focus practice here.",
                "Your vocabulary growth rate of 62 new words in 4 weeks is above average. Keep it up!",
                "Recommended: practice 'business email writing' and 'presentations' to reach Advanced level.",
              ].map((insight, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="text-accent mt-0.5">●</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
