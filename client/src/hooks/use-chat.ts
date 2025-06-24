import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatResponse {
  response: string;
  citations?: string[];
  sessionId: string;
  metadata?: any;
}

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (question: string): Promise<ChatResponse> => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/consultation", {
        question,
        sessionId: currentSessionId,
      });

      const data = await response.json();
      
      if (!currentSessionId) {
        setCurrentSessionId(data.sessionId);
      }

      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = async (sessionId: string) => {
    try {
      const response = await apiRequest("GET", `/api/chat-history/${sessionId}`);
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    sendMessage,
    getChatHistory,
    isLoading,
    currentSessionId,
  };
}
