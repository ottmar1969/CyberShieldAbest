import OpenAI from "openai";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("OPENAI_API_KEY not found - OpenAI features will be unavailable");
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey || "sk-placeholder-key-for-demo",
    });
  }

  async analyzeCybersecurityQuestion(question: string, perplexityData?: any): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      return `**Demo Mode - Professional Cybersecurity Analysis**

**Question:** ${question}

**Expert Analysis:**
This is a demonstration of our AI-powered cybersecurity consultant. In the full version with API keys configured, you would receive:

1. **Technical Explanation**: Detailed breakdown of the security concept or threat
2. **Risk Assessment**: Professional evaluation of potential impacts and likelihood
3. **Actionable Recommendations**: Step-by-step security measures and best practices
4. **Implementation Guide**: Practical steps for deployment
5. **Compliance Considerations**: Relevant regulatory and framework guidance

**Latest Threat Intelligence**: Real-time research from Perplexity AI would provide current threat landscape data.

**Next Steps**: Add your OpenAI and Perplexity API keys to unlock the full AI-powered analysis capability.

*This platform combines multiple AI models to provide comprehensive cybersecurity guidance typically available only through expensive consulting services.*`;
    }

    const prompt = `You are a senior cybersecurity analyst. Analyze this cybersecurity question and provide expert guidance.

Question: ${question}

${perplexityData ? `Additional research context: ${JSON.stringify(perplexityData)}` : ''}

Provide a comprehensive analysis including:
1. Technical explanation
2. Risk assessment
3. Actionable recommendations
4. Implementation steps
5. Best practices

Format your response in a clear, professional manner suitable for both technical and non-technical audiences.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "I apologize, but I'm unable to process your request at the moment. Please ensure your OpenAI API key is properly configured.";
    }
  }

  async enhanceSecurityAnalysis(input: string, toolType: string): Promise<any> {
    const prompt = `As a cybersecurity expert, analyze this ${toolType} input and provide enhanced security insights:

Input: ${input}
Tool Type: ${toolType}

Provide detailed analysis in JSON format with security recommendations, risk levels, and actionable steps.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a cybersecurity expert. Provide analysis in JSON format with detailed security insights.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      throw new Error("Failed to enhance security analysis: " + (error as Error).message);
    }
  }
}

export const openaiService = new OpenAIService();
