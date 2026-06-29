/**
 * Voice Analysis page — uses audio-analyzer scaffold to transcribe and analyze
 * recorded speech, providing pronunciation and fluency feedback.
 */
import { redirect } from "@react-router/node";
import type { LoaderFunctionArgs } from "@react-router/node";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { SpeakUpSidebar } from "~/components/speakup/sidebar";
import {
  useTranscribe,
  useTranscriptionResult,
  TranscriptionUpload,
  TranscriptionResult,
} from "@qb/audio-analyzer";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function VoiceAnalysisPage() {
  const { config } = useConfigurables();
  const tutorName = config?.aiTutorName ?? "Aria";

  const { submit, ticketId, isSubmitting, error: submitError } = useTranscribe();
  const {
    result,
    status,
    isLoading: isAnalyzing,
  } = useTranscriptionResult(ticketId ?? null);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    await submit(files, {
      domain_context:
        "English speaking practice. Evaluate pronunciation clarity, fluency, grammar, and vocabulary usage by a non-native English learner.",
      speaker_roles: ["student"],
      scoring_rules: [
        { category: "Pronunciation", description: "Clarity and accuracy of English sounds and stress patterns" },
        { category: "Fluency", description: "Smoothness, pace, and natural flow of speech" },
        { category: "Grammar", description: "Correct use of English grammar structures" },
        { category: "Vocabulary", description: "Range and appropriateness of vocabulary used" },
      ],
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SpeakUpSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-card border-b border-border px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-foreground">Voice Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Upload a recording and get detailed pronunciation feedback from {tutorName}
          </p>
        </div>

        <div className="px-8 py-6 max-w-3xl mx-auto space-y-6">
          {/* Upload */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-2">Upload Your Recording</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Record yourself speaking English — reading aloud, having a mock conversation, or
              practicing a scenario — then upload the audio file for AI analysis.
            </p>
            <TranscriptionUpload
              onFilesSelected={handleUpload}
              isSubmitting={isSubmitting}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-background"
            />
            {submitError && (
              <p className="text-destructive text-sm mt-3">{submitError}</p>
            )}
          </div>

          {/* Analysis Results */}
          {ticketId && (
            <TranscriptionResult.Root ticketId={ticketId} result={result} status={status} isLoading={isAnalyzing}>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">{tutorName}'s Analysis</h2>
                  <TranscriptionResult.Status />
                </div>

                <TranscriptionResult.Loading>
                  <div className="flex items-center gap-3 py-8 justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                    <span className="text-muted-foreground">Analyzing your speech...</span>
                  </div>
                </TranscriptionResult.Loading>

                <TranscriptionResult.Error>
                  <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
                    Analysis failed. Please try uploading again.
                  </div>
                </TranscriptionResult.Error>

                <TranscriptionResult.Content>
                  <TranscriptionResult.Summary />
                  <TranscriptionResult.Scores />
                  <TranscriptionResult.Transcript />
                  <TranscriptionResult.Strengths />
                  <TranscriptionResult.Issues />
                </TranscriptionResult.Content>
              </div>
            </TranscriptionResult.Root>
          )}

          {/* Tips */}
          {!ticketId && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>💡</span> Recording Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🎙️ Use a quiet environment for clearest results</li>
                <li>⏱️ Aim for at least 30 seconds of speech for better analysis</li>
                <li>📝 Try reading a paragraph aloud or practicing a scenario</li>
                <li>🔄 Compare multiple recordings to track your improvement</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
