import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Search, Info } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { Link } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: any;
  citations?: string[];
  timestamp: Date;
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome! I'm your AI cybersecurity consultant. Ask me anything about:\n\n• Threat analysis and vulnerability assessment\n• Security architecture and best practices\n• Incident response and forensics\n• Compliance and regulatory requirements\n• Security tools and technologies",
      timestamp: new Date(),
    }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await sendMessage(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        citations: response.citations,
        metadata: response.metadata,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your question. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Card className="bg-cyber-card border-cyber-border shadow-lg">
      <CardHeader className="border-b border-cyber-border">
        <CardTitle className="text-lg font-semibold text-cyber-cyan flex items-center">
          <MessageCircle className="mr-2" />
          Cybersecurity Consultation
        </CardTitle>
        <p className="text-sm text-cyber-text-dim">Ask any cybersecurity question - $2 per consultation</p>
      </CardHeader>

      <CardContent className="p-0">
        {/* Chat Messages */}
        <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-cyber-cyan" 
                    : "bg-gradient-cyber"
                }`}>
                  {message.role === "user" ? (
                    <User className="text-cyber-dark text-sm" />
                  ) : (
                    <Bot className="text-cyber-dark text-sm" />
                  )}
                </div>
                
                <div className={`max-w-md rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-cyber-cyan text-cyber-dark"
                    : "bg-cyber-border"
                }`}>
                  {message.role === "assistant" && message.metadata && (
                    <div className="flex items-center mb-2 text-xs text-cyber-green">
                      <Search className="mr-1 h-3 w-3" />
                      Analyzing latest threat intelligence...
                    </div>
                  )}
                  
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-cyber-border">
                      <p className="text-xs text-cyber-text-dim flex items-center">
                        <Info className="mr-1 h-3 w-3" />
                        Based on latest research and threat intelligence
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-cyber rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-cyber-dark text-sm" />
                </div>
                <div className="bg-cyber-border p-3 rounded-lg max-w-md">
                  <div className="flex items-center text-cyber-green text-sm">
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your cybersecurity question...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-cyber-border p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your cybersecurity question..."
              className="flex-1 bg-cyber-dark border-cyber-border focus:border-cyber-cyan focus:ring-cyber-cyan"
              disabled={isLoading}
            />
            <Link href="/checkout">
              <Button
                type="button"
                className="bg-cyber-cyan text-cyber-dark hover:bg-cyber-green transition-colors flex items-center"
              >
                <Send className="mr-2 h-4 w-4" />
                Send ($2)
              </Button>
            </Link>
          </form>
          <p className="text-xs text-cyber-text-dim mt-2 flex items-center">
            <Info className="mr-1 h-3 w-3" />
            Each question costs $2. Powered by advanced AI and real-time threat intelligence.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
