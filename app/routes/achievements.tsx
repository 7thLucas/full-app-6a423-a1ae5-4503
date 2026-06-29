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

const badges = [
  { id: "first-session",    icon: "🎙️", title: "First Words",       description: "Completed your first speaking session", earned: true, date: "Jun 22" },
  { id: "streak-3",         icon: "🔥", title: "On Fire",           description: "Maintained a 3-day speaking streak",       earned: true, date: "Jun 25" },
  { id: "streak-7",         icon: "🔥", title: "Week Warrior",      description: "Maintained a 7-day speaking streak",       earned: true, date: "Jun 28" },
  { id: "vocab-50",         icon: "📚", title: "Word Collector",    description: "Learned 50 new vocabulary words",          earned: true, date: "Jun 26" },
  { id: "vocab-100",        icon: "📖", title: "Vocabulary Master", description: "Learned 100 new vocabulary words",         earned: true, date: "Jun 28" },
  { id: "scenario-job",     icon: "💼", title: "Career Ready",      description: "Completed a job interview scenario",       earned: true, date: "Jun 27" },
  { id: "pronunciation-75", icon: "🎯", title: "Clear Speaker",     description: "Reached 75% pronunciation score",          earned: true, date: "Jun 28" },
  { id: "streak-30",        icon: "🏅", title: "Month Master",      description: "Maintained a 30-day speaking streak",      earned: false },
  { id: "vocab-500",        icon: "🏆", title: "Word Champion",     description: "Learned 500 new vocabulary words",         earned: false },
  { id: "advanced",         icon: "⭐", title: "Advanced Speaker",  description: "Reached Advanced proficiency level",       earned: false },
  { id: "all-scenarios",    icon: "🌟", title: "Scenario Master",   description: "Completed all practice scenarios",         earned: false },
  { id: "perfect-week",     icon: "💎", title: "Perfect Week",      description: "Hit daily goal every day for a week",     earned: false },
];

export default function AchievementsPage() {
  const { config } = useConfigurables();
  const showBadges = config?.enableAchievementBadges !== false;

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            {earned.length} of {badges.length} badges earned
          </p>
        </div>

        {!showBadges ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Achievements are currently disabled.
          </div>
        ) : (
          <div className="px-8 py-6 space-y-8">
            {/* Progress */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground">Badge Progress</h2>
                <span className="text-sm text-primary font-semibold">{earned.length}/{badges.length}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${(earned.length / badges.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Earned Badges */}
            <div>
              <h2 className="font-semibold text-foreground mb-4">Earned Badges 🎉</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {earned.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-card border border-primary/30 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{badge.title}</h3>
                    <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{badge.description}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Earned {badge.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h2 className="font-semibold text-foreground mb-4">Locked Badges 🔒</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {locked.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-muted border border-border rounded-2xl p-5 text-center opacity-60"
                  >
                    <div className="text-5xl mb-3 grayscale">{badge.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{badge.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
