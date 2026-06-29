import { Link } from "react-router";
import { redirect } from "@react-router/node";
import type { LoaderFunctionArgs } from "@react-router/node";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { SpeakUpSidebar } from "~/components/speakup/sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm ${color ?? ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function DashboardPage() {
  const { config, loading } = useConfigurables();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SpeakUpSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const appName = config?.appName ?? "SpeakUp";
  const tutorName = config?.aiTutorName ?? "Aria";
  const dailyGoal = config?.dailyGoalMinutes ?? 15;
  const scenarios = config?.practiceScenarios ?? [];

  // Mock progress data — real app wires to backend
  const streak = 7;
  const pronunciationScore = 78;
  const grammarScore = 84;
  const vocabCount = 142;
  const dailyDoneMinutes = 10;
  const weeklyProgress = [65, 70, 60, 80, 85, 78, 84];
  const recentWords = ["eloquent", "persuasive", "negotiate", "initiative", "collaborate"];

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.username ?? "Learner"} 👋</p>
          </div>
          <Link
            to="/tutor"
            className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm"
          >
            🎙️ Start Speaking
          </Link>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Daily Goal */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-foreground">Today's Speaking Goal</h2>
                <p className="text-sm text-muted-foreground">{dailyDoneMinutes} / {dailyGoal} minutes completed</p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
            <ProgressBar value={dailyDoneMinutes} max={dailyGoal} color="bg-primary" />
            {dailyDoneMinutes >= dailyGoal && (
              <p className="text-primary font-medium text-sm mt-2">🎉 Daily goal complete!</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="🔥" label="Speaking Streak" value={`${streak} days`} sub="Keep it up!" />
            <StatCard icon="🎯" label="Pronunciation" value={`${pronunciationScore}%`} sub="+5% this week" />
            <StatCard icon="✏️" label="Grammar Score" value={`${grammarScore}%`} sub="+3% this week" />
            <StatCard icon="📚" label="Vocabulary" value={`${vocabCount} words`} sub="142 learned" />
          </div>

          {/* Weekly Progress + Recent Words */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Progress */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Weekly Progress</h3>
              <div className="flex items-end gap-2 h-28">
                {weeklyProgress.map((score, i) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary rounded-t-sm transition-all"
                        style={{ height: `${score}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Words */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Recently Learned Words</h3>
              <div className="space-y-3">
                {recentWords.map((word, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-foreground font-medium capitalize">{word}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">New</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recommended Practice</h3>
              <Link to="/scenarios" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.slice(0, 3).map((s) => (
                <Link
                  key={s.id}
                  to={`/tutor?scenario=${s.id}`}
                  className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
                >
                  <span className="text-3xl">{s.icon ?? "🎯"}</span>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.title}
                    </h4>
                    {s.description && (
                      <p className="text-muted-foreground text-sm mt-1">{s.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Tip */}
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-foreground mb-1">{tutorName}'s Tip of the Day</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Focus on linking words naturally — instead of saying "I went to the store", try saying it
                as one smooth phrase: "IwentdaStore." Connected speech is what makes you sound fluent!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
