/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // SpeakUp identity
  appTagline?: string;
  appDescription?: string;
  // Learning config
  proficiencyLevels?: string[];
  practiceScenarios?: { id: string; title: string; icon?: string; description?: string }[];
  dailyGoalMinutes?: number;
  maxStreakDisplayDays?: number;
  enableNotifications?: boolean;
  enableAchievementBadges?: boolean;
  enableDailyChallenges?: boolean;
  // Landing page copy
  heroHeading?: string;
  heroSubheading?: string;
  heroCTA?: string;
  landingFeatures?: { icon: string; title: string; description?: string }[];
  // AI tutor config
  aiTutorSystemPrompt?: string;
  aiTutorName?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  logoUrl: "",
  font: {
    headingFont: "Outfit",
    textFont: "Inter",
  },
  // ── SpeakUp Defaults ─────────────────────────────────────────────────
  appName: "SpeakUp",
  brandColor: {
    background: "#F8F9FF",
    foreground: "#1E1B4B",
    card: "#FFFFFF",
    cardForeground: "#1E1B4B",
    popover: "#FFFFFF",
    popoverForeground: "#1E1B4B",
    primary: "#6366F1",
    primaryForeground: "#FFFFFF",
    secondary: "#06B6D4",
    secondaryForeground: "#FFFFFF",
    muted: "#EEF2FF",
    mutedForeground: "#6B7280",
    accent: "#F59E0B",
    accentForeground: "#FFFFFF",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#E0E7FF",
    input: "#E0E7FF",
    ring: "#6366F1",
    chart1: "#6366F1",
    chart2: "#06B6D4",
    chart3: "#F59E0B",
    chart4: "#10B981",
    chart5: "#F43F5E",
    navbarBackground: "#6366F1",
    sidebarBackground: "#1E1B4B",
    sidebarForeground: "#E0E7FF",
    sidebarPrimary: "#6366F1",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#312E81",
    sidebarAccentForeground: "#E0E7FF",
    sidebarBorder: "#312E81",
    sidebarRing: "#6366F1",
  },
  appTagline: "Your AI English tutor — patient, personalized, always on",
  appDescription: "Practice speaking English with your personal AI tutor available 24/7. Get instant feedback on pronunciation, grammar, and fluency.",
  proficiencyLevels: ["Beginner", "Intermediate", "Advanced"],
  practiceScenarios: [
    { id: "daily-conversation", title: "Daily Conversation", icon: "💬", description: "Practice everyday small talk and common situations" },
    { id: "business-english",   title: "Business English",   icon: "💼", description: "Master professional communication and meetings" },
    { id: "job-interview",      title: "Job Interview",      icon: "🎯", description: "Prepare for interview questions with confidence" },
    { id: "travel-english",     title: "Travel English",     icon: "✈️", description: "Navigate airports, hotels, and tourist spots" },
    { id: "presentations",      title: "Presentations",      icon: "📊", description: "Deliver clear and compelling presentations" },
    { id: "ordering-food",      title: "Ordering Food",      icon: "🍽️", description: "Confidently order at restaurants and cafes" },
  ],
  dailyGoalMinutes: 15,
  maxStreakDisplayDays: 365,
  enableNotifications: true,
  enableAchievementBadges: true,
  enableDailyChallenges: true,
  heroHeading: "Speak English With Confidence",
  heroSubheading: "Your personal AI English tutor — available 24/7, judgment-free, and tailored to your goals.",
  heroCTA: "Start Speaking Now",
  landingFeatures: [
    { icon: "🎙️", title: "Voice Conversations", description: "Have real conversations with your AI tutor and get instant feedback" },
    { icon: "📈", title: "Track Your Progress", description: "See your pronunciation, grammar, and vocabulary improve over time" },
    { icon: "🎯", title: "Personalized Path", description: "AI adapts to your level and goals for the fastest improvement" },
    { icon: "🏆", title: "Daily Challenges", description: "Short exercises with streak tracking to keep you consistent" },
  ],
  aiTutorName: "Aria",
  aiTutorSystemPrompt: "You are Aria, a friendly and encouraging AI English speaking tutor. Your role is to help non-native English speakers improve their spoken English through natural conversation. After each user message, provide conversational responses, then briefly note any pronunciation tips, grammar corrections, or vocabulary suggestions in a kind, non-interruptive way. Always encourage the learner and celebrate their progress.",
};
