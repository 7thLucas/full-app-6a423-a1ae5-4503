import { useState, useRef, useEffect } from "react";
import { redirect } from "@react-router/node";
import type { LoaderFunctionArgs } from "@react-router/node";
import { useSearchParams } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { SpeakUpSidebar } from "~/components/speakup/sidebar";
import { useSpeakingTutor } from "~/modules/agentic/hooks/use-speaking-tutor";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

function WaveformAnimation({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 bg-primary rounded-full transition-all ${
            active ? "animate-bounce" : "h-2"
          }`}
          style={{ animationDelay: `${i * 0.1}s`, height: active ? undefined : "8px" }}
        />
      ))}
    </div>
  );
}

export default function TutorPage() {
  const { config, loading } = useConfigurables();
  const [searchParams] = useSearchParams();
  const scenarioId = searchParams.get("scenario");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemPrompt = config?.aiTutorSystemPrompt;
  const tutorName = config?.aiTutorName ?? "Aria";
  const scenarios = config?.practiceScenarios ?? [];
  const activeScenario = scenarios.find((s) => s.id === scenarioId);

  const { messages, isLoading, error, sendMessage, clearConversation } = useSpeakingTutor(
    activeScenario
      ? `${systemPrompt ?? "You are Aria, a friendly AI English speaking tutor."} The student wants to practice: ${activeScenario.title}. ${activeScenario.description ?? ""}`
      : systemPrompt
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg">
              🤖
            </div>
            <div>
              <h1 className="font-bold text-foreground">{tutorName}</h1>
              <p className="text-xs text-muted-foreground">
                {activeScenario ? `Practice: ${activeScenario.title}` : "AI English Tutor"}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-6">🎙️</div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Hi! I'm {tutorName} 👋
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mb-8">
                {activeScenario
                  ? `Let's practice "${activeScenario.title}"! I'll respond naturally and give you feedback after each message.`
                  : "Ready to practice English? Just type what you'd like to say, or pick a topic and we'll have a natural conversation!"}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "Let's start a conversation",
                  "Help me introduce myself",
                  "Practice job interview",
                  "How's the weather today?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="bg-muted text-foreground text-sm px-4 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-2xl rounded-bl-sm"
                } px-5 py-4 shadow-sm`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {/* Feedback section */}
                {msg.role === "assistant" && msg.feedback && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Feedback
                    </p>
                    {msg.feedback.pronunciation && (
                      <div className="flex items-start gap-2 text-sm">
                        <span>🔊</span>
                        <span className="text-muted-foreground">{msg.feedback.pronunciation}</span>
                      </div>
                    )}
                    {msg.feedback.grammar && (
                      <div className="flex items-start gap-2 text-sm">
                        <span>✏️</span>
                        <span className="text-muted-foreground">{msg.feedback.grammar}</span>
                      </div>
                    )}
                    {msg.feedback.vocabulary && (
                      <div className="flex items-start gap-2 text-sm">
                        <span>📚</span>
                        <span className="text-muted-foreground">{msg.feedback.vocabulary}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs opacity-50 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <WaveformAnimation active />
                  <span className="text-muted-foreground text-sm">{tutorName} is responding...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border px-8 py-4">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type what you want to say in English... (Enter to send)"
              rows={2}
              className="flex-1 resize-none bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-5 py-3 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Send 🎙️
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 max-w-4xl mx-auto">
            Press Enter to send • Shift+Enter for new line • Your tutor will give gentle feedback after each message
          </p>
        </div>
      </main>
    </div>
  );
}
