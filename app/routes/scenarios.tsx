import { Link } from "react-router";
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

export default function ScenariosPage() {
  const { config, loading } = useConfigurables();

  const scenarios = config?.practiceScenarios ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">Practice Scenarios</h1>
          <p className="text-sm text-muted-foreground">Choose a real-life situation to practice speaking</p>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {scenarios.map((scenario) => (
                <Link
                  key={scenario.id}
                  to={`/tutor?scenario=${scenario.id}`}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="text-5xl mb-4">{scenario.icon ?? "🎯"}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {scenario.title}
                  </h3>
                  {scenario.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {scenario.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Start Practice →
                  </div>
                </Link>
              ))}

              {scenarios.length === 0 && (
                <div className="col-span-3 text-center py-24 text-muted-foreground">
                  <p className="text-4xl mb-4">🎭</p>
                  <p>No practice scenarios configured yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
