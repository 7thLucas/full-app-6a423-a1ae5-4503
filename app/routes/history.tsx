import { redirect } from "@react-router/node";
import type { LoaderFunctionArgs } from "@react-router/node";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { SpeakUpSidebar } from "~/components/speakup/sidebar";
import { Link } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

const mockHistory = [
  {
    id: "1",
    date: "2026-06-28",
    scenario: "Job Interview",
    duration: 18,
    pronunciationScore: 76,
    grammarScore: 82,
    wordsLearned: ["eloquent", "articulate"],
    feedback: "Great improvement in sentence structure! Work on the 'th' sound.",
  },
  {
    id: "2",
    date: "2026-06-27",
    scenario: "Daily Conversation",
    duration: 12,
    pronunciationScore: 71,
    grammarScore: 79,
    wordsLearned: ["persuasive", "initiative"],
    feedback: "Excellent use of linking words! Your fluency is improving.",
  },
  {
    id: "3",
    date: "2026-06-26",
    scenario: "Business English",
    duration: 20,
    pronunciationScore: 68,
    grammarScore: 74,
    wordsLearned: ["negotiate", "collaborate"],
    feedback: "Good professional vocabulary! Focus on past tense consistency.",
  },
];

export default function HistoryPage() {
  const { config } = useConfigurables();
  const tutorName = config?.aiTutorName ?? "Aria";

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">Conversation History</h1>
          <p className="text-sm text-muted-foreground">Review past sessions and feedback from {tutorName}</p>
        </div>

        <div className="px-8 py-6 space-y-4">
          {mockHistory.map((session) => (
            <div key={session.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{session.scenario}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString("en-US", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                    })} · {session.duration} min
                  </p>
                </div>
                <Link
                  to="/tutor"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Practice again →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Pronunciation</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground">{session.pronunciationScore}%</span>
                    <div className="flex-1 bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${session.pronunciationScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Grammar</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground">{session.grammarScore}%</span>
                    <div className="flex-1 bg-background rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${session.grammarScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Words learned:</span>
                {session.wordsLearned.map((word) => (
                  <span
                    key={word}
                    className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-start gap-2">
                <span>💡</span>
                <p className="text-sm text-foreground">{tutorName}: {session.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
