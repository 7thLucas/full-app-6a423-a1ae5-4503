import { Link, useLocation, Form } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";

const navItems = [
  { href: "/dashboard",       icon: "🏠", label: "Dashboard" },
  { href: "/tutor",           icon: "🎙️", label: "AI Tutor" },
  { href: "/scenarios",       icon: "🎭", label: "Scenarios" },
  { href: "/voice-analysis",  icon: "🔊", label: "Voice Analysis" },
  { href: "/history",         icon: "📖", label: "History" },
  { href: "/progress",        icon: "📈", label: "Progress" },
  { href: "/achievements",    icon: "🏆", label: "Achievements" },
];

export function SpeakUpSidebar() {
  const { config } = useConfigurables();
  const { user } = useAuth();
  const location = useLocation();
  const appName = config?.appName ?? "SpeakUp";

  return (
    <aside className="w-64 min-h-screen bg-sidebarBackground flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-sidebarBorder flex items-center gap-3">
        {config?.logoUrl ? (
          <img src={config.logoUrl} alt={appName} className="h-8 w-8 rounded-lg object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-sidebarPrimary flex items-center justify-center text-sidebarPrimaryForeground font-bold text-sm">
            S
          </div>
        )}
        <span className="text-sidebarForeground font-bold text-lg">{appName}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebarAccent text-sidebarAccentForeground"
                  : "text-sidebarForeground hover:bg-sidebarAccent/50 hover:text-sidebarAccentForeground"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-sidebarBorder pt-4">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-sidebarPrimary flex items-center justify-center text-sidebarPrimaryForeground font-semibold text-sm">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebarForeground text-sm font-medium truncate">{user?.username ?? "Learner"}</p>
            <p className="text-sidebarForeground/60 text-xs truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        <Form method="post" action="/auth/logout">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-sidebarForeground/70 hover:bg-sidebarAccent/50 hover:text-sidebarAccentForeground transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </Form>
      </div>
    </aside>
  );
}
