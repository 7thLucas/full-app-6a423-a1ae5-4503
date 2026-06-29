import { useState, useCallback } from "react";
import { invokeLLM } from "@qb/agentic";

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  feedback?: {
    pronunciation?: string;
    grammar?: string;
    vocabulary?: string;
  };
  timestamp: Date;
}

export function useSpeakingTutor(systemPrompt?: string) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultSystem = systemPrompt ??
    "You are Aria, a friendly AI English speaking tutor. Help the user practice English conversation. After responding naturally, add a brief section starting with '---FEEDBACK---' that includes: pronunciation tip (if relevant), a gentle grammar correction (if needed), and a new vocabulary word. Keep feedback brief and encouraging.";

  const sendMessage = useCallback(
    async (userText: string) => {
      setError(null);
      const userMsg: TutorMessage = {
        role: "user",
        content: userText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const conversationContext = messages
          .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
          .join("\n");

        const prompt = conversationContext
          ? `${conversationContext}\nStudent: ${userText}`
          : `Student: ${userText}`;

        const result = await invokeLLM({
          message: prompt,
          systemPrompt: defaultSystem,
          schema: {
            type: "object",
            properties: {
              response: { type: "string" },
              feedbackSection: { type: "string" },
            },
            required: ["response"],
          },
        });

        const data = result as { response?: string; feedbackSection?: string };
        const fullResponse = data.response ?? String(result);

        // Parse feedback from response
        const [conversationPart, feedbackPart] = fullResponse.split("---FEEDBACK---");
        const feedback: TutorMessage["feedback"] = {};
        if (feedbackPart) {
          const grammarMatch = feedbackPart.match(/grammar[:\s]+(.+?)(?:\n|$)/i);
          const pronunciationMatch = feedbackPart.match(/pronunciation[:\s]+(.+?)(?:\n|$)/i);
          const vocabMatch = feedbackPart.match(/vocab(?:ulary)?[:\s]+(.+?)(?:\n|$)/i);
          if (grammarMatch) feedback.grammar = grammarMatch[1].trim();
          if (pronunciationMatch) feedback.pronunciation = pronunciationMatch[1].trim();
          if (vocabMatch) feedback.vocabulary = vocabMatch[1].trim();
        }

        const assistantMsg: TutorMessage = {
          role: "assistant",
          content: conversationPart?.trim() ?? fullResponse,
          feedback: Object.keys(feedback).length > 0 ? feedback : undefined,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError((err as Error).message ?? "Failed to get response");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, defaultSystem]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearConversation };
}
