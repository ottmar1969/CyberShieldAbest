interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations: string[];
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class PerplexityService {
  private apiKey: string;
  private baseUrl = "https://api.perplexity.ai/chat/completions";

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("PERPLEXITY_API_KEY not found - Perplexity features will be unavailable");
    }
  }

  async query(question: string, systemPrompt?: string): Promise<PerplexityResponse> {
    if (!this.apiKey) {
      // Return a mock response when API key is not available
      return {
        id: "mock-response",
        model: "llama-3.1-sonar-small-128k-online",
        object: "chat.completion",
        created: Date.now(),
        citations: ["https://example.com/cybersecurity-research"],
        choices: [{
          index: 0,
          finish_reason: "stop",
          message: {
            role: "assistant",
            content: "This is a demo response. Please add your Perplexity API key for real-time threat intelligence."
          },
          delta: {
            role: "assistant",
            content: ""
          }
        }],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150
        }
      };
    }

    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
    }
    
    messages.push({
      role: "user",
      content: question
    });

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_related_questions: false,
        search_recency_filter: "month",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getCybersecurityGuidance(question: string): Promise<PerplexityResponse> {
    const systemPrompt = `You are an expert cybersecurity consultant with deep knowledge of:
- Threat analysis and vulnerability assessment
- Security architecture and best practices  
- Incident response and digital forensics
- Compliance frameworks (SOC2, ISO27001, NIST, etc.)
- Security tools and technologies
- Risk management and security governance

Provide comprehensive, actionable cybersecurity guidance. Include:
1. Clear explanation of the security concept or issue
2. Best practices and recommendations
3. Potential risks and mitigation strategies
4. Relevant compliance considerations
5. References to current threat landscape when applicable

Be precise, professional, and focus on practical implementation.`;

    return this.query(question, systemPrompt);
  }
}

export const perplexityService = new PerplexityService();
