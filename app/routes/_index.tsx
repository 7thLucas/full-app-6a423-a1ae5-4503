import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";

export default function LandingPage() {
  const { config, loading } = useConfigurables();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const appName = config?.appName ?? "SpeakUp";
  const tagline = config?.appTagline ?? "Your AI English tutor — patient, personalized, always on";
  const heroHeading = config?.heroHeading ?? "Speak English With Confidence";
  const heroSubheading = config?.heroSubheading ?? "Practice with your AI tutor 24/7";
  const heroCTA = config?.heroCTA ?? "Start Speaking Now";
  const features: Array<{ icon: string; title: string; description?: string }> = config?.landingFeatures ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="bg-navbarBackground px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={appName} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
          )}
          <span className="text-primary-foreground font-bold text-xl">{appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="bg-primary-foreground text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
          🎙️ AI-Powered English Tutor
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
          {heroHeading}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          {heroSubheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/register"
            className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 text-lg"
          >
            {heroCTA}
          </Link>
          <Link
            to="/auth/login"
            className="border border-border text-foreground font-semibold px-8 py-4 rounded-xl hover:bg-muted transition-colors text-lg"
          >
            Sign In
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{tagline}</p>
      </section>

      {/* Proficiency Tiers */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {(config?.proficiencyLevels ?? ["Beginner", "Intermediate", "Advanced"]).map((level) => (
            <span
              key={level}
              className="bg-card border border-border text-foreground px-6 py-3 rounded-full text-sm font-medium shadow-sm"
            >
              {level === "Beginner" ? "🌱" : level === "Intermediate" ? "🌿" : "🌳"} {level}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Everything You Need to Speak Fluently
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feat.title}</h3>
                {feat.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practice Scenarios */}
      <section className="bg-muted px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Practice Real-Life Scenarios</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Choose a topic and start speaking immediately — no scheduling needed.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(config?.practiceScenarios ?? []).map((scenario) => (
              <div
                key={scenario.id}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{scenario.icon ?? "🎯"}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{scenario.title}</h3>
                  {scenario.description && (
                    <p className="text-muted-foreground text-sm mt-1">{scenario.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Sound More Confident?
        </h2>
        <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
          Join learners improving their English every day with personalized AI coaching.
        </p>
        <Link
          to="/auth/register"
          className="bg-primary-foreground text-primary font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg"
        >
          {heroCTA}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-sidebarBackground px-6 py-8 text-center">
        <p className="text-sidebarForeground/60 text-sm">
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
