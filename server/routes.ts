import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage.js";
import { perplexityService } from "./services/perplexity.js";
import { openaiService } from "./services/openai.js";
import { securityToolsService } from "./services/security-tools.js";
import { insertChatMessageSchema, insertToolUsageSchema, insertUserSchema } from "@shared/schema.js";
import { v4 as uuidv4 } from "uuid";
import rateLimit from "express-rate-limit";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn("STRIPE_SECRET_KEY not found - Stripe payment features will be unavailable");
}

// Rate limiting for security
const consultationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 consultations per windowMs
  message: "Too many consultation requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const toolsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 tool uses per windowMs
  message: "Too many tool requests, please try again later",
});

// Helper function to get or create user based on session/fingerprint
async function getOrCreateUser(req: any): Promise<any> {
  const sessionId = req.sessionID || uuidv4();
  const ipAddress = req.ip || req.connection.remoteAddress;
  const fingerprint = req.body.fingerprint || req.headers['x-fingerprint'];

  // Try to find existing user by session
  let user = await storage.getUserBySessionId(sessionId);
  
  // If not found and we have fingerprint, try to find by fingerprint
  if (!user && fingerprint) {
    user = await storage.getUserByFingerprint(fingerprint, ipAddress);
  }
  
  // Create new user if not found
  if (!user) {
    user = await storage.createUser({
      sessionId,
      ipAddress,
      fingerprint,
    });
  } else {
    // Update last activity
    await storage.updateUserActivity(user.id);
  }
  
  return user;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create payment intent for consultation
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe payment service unavailable" });
      }
      
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          type: "consultation"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // User profile endpoint
  app.get("/api/user/profile", async (req, res) => {
    try {
      const user = await getOrCreateUser(req);
      res.json({
        id: user.id,
        credits: user.credits,
        hasUsedFreeQuestion: user.hasUsedFreeQuestion,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user profile: " + error.message });
    }
  });

  // AI Consultation endpoint with credit system
  app.post("/api/consultation", consultationLimiter, async (req, res) => {
    try {
      const { question, sessionId } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get or create user
      const user = await getOrCreateUser(req);
      
      // Check if user has enough credits
      const questionCost = 5.00;
      const userCredits = parseFloat(user.credits);
      
      if (userCredits < questionCost) {
        return res.status(402).json({ 
          message: "Insufficient credits. Please purchase more credits to continue.",
          requiredCredits: questionCost,
          userCredits: userCredits
        });
      }

      // Deduct credits
      const newCredits = (userCredits - questionCost).toFixed(2);
      await storage.updateUserCredits(user.id, newCredits);
      
      // Mark free question as used if this was the first question
      if (!user.hasUsedFreeQuestion) {
        await storage.updateFreeQuestionUsed(user.id);
      }

      // Create or get chat session
      let session = await storage.getChatSession(sessionId || uuidv4());
      if (!session) {
        session = await storage.createChatSession({
          userId: user.id,
          sessionId: sessionId || uuidv4(),
        });
      }

      // Save user question
      await storage.createChatMessage({
        sessionId: session.id,
        userId: user.id,
        role: "user",
        content: question,
        cost: questionCost.toString(),
        metadata: null,
      });

      // Get AI response using Perplexity for research
      const perplexityResponse = await perplexityService.getCybersecurityGuidance(question);
      
      // Enhance with OpenAI analysis
      const enhancedAnalysis = await openaiService.analyzeCybersecurityQuestion(
        question, 
        perplexityResponse
      );

      // Combine responses
      const finalResponse = {
        content: enhancedAnalysis,
        citations: perplexityResponse.citations || [],
        metadata: {
          perplexityModel: perplexityResponse.model,
          tokens: perplexityResponse.usage,
          timestamp: new Date().toISOString(),
        }
      };

      // Save AI response
      await storage.createChatMessage({
        sessionId: session.id,
        userId: user.id,
        role: "assistant",
        content: finalResponse.content,
        cost: null,
        metadata: finalResponse.metadata,
      });

      res.json({
        response: finalResponse.content,
        citations: finalResponse.citations,
        sessionId: session.sessionId,
        metadata: finalResponse.metadata,
        remainingCredits: newCredits,
      });

    } catch (error: any) {
      console.error("Consultation error:", error);
      res.status(500).json({ message: "Error processing consultation: " + error.message });
    }
  });

  // Get chat history
  app.get("/api/chat-history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const messages = await storage.getSessionMessages(session.id);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching chat history: " + error.message });
    }
  });

  // Security Tools Endpoints

  // Password Strength Analyzer
  app.post("/api/tools/password-strength", toolsLimiter, async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const analysis = await securityToolsService.analyzePasswordStrength(password);
      
      // Get user for logging
      const user = await getOrCreateUser(req);
      
      // Log tool usage (without storing the actual password)
      await storage.createToolUsage({
        userId: user.id,
        toolName: "password-strength",
        input: "password_provided",
        result: analysis,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error analyzing password: " + error.message });
    }
  });

  // Website Security Scanner
  app.post("/api/tools/website-security", toolsLimiter, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const analysis = await securityToolsService.scanWebsiteSecurity(url);
      
      const user = await getOrCreateUser(req);
      
      await storage.createToolUsage({
        userId: user.id,
        toolName: "website-security",
        input: url,
        result: analysis,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error scanning website: " + error.message });
    }
  });

  // SSL Certificate Checker
  app.post("/api/tools/ssl-check", toolsLimiter, async (req, res) => {
    try {
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain is required" });
      }

      const analysis = await securityToolsService.checkSSLCertificate(domain);
      
      const user = await getOrCreateUser(req);
      
      await storage.createToolUsage({
        userId: user.id,
        toolName: "ssl-check",
        input: domain,
        result: analysis,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error checking SSL certificate: " + error.message });
    }
  });

  // Phishing URL Detector
  app.post("/api/tools/phishing-detector", toolsLimiter, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const analysis = await securityToolsService.detectPhishingURL(url);
      
      const user = await getOrCreateUser(req);
      
      await storage.createToolUsage({
        userId: user.id,
        toolName: "phishing-detector",
        input: url,
        result: analysis,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error detecting phishing URL: " + error.message });
    }
  });

  // Security Headers Analyzer
  app.post("/api/tools/security-headers", toolsLimiter, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const analysis = await securityToolsService.analyzeSecurityHeaders(url);
      
      const user = await getOrCreateUser(req);
      
      await storage.createToolUsage({
        userId: user.id,
        toolName: "security-headers",
        input: url,
        result: analysis,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error analyzing security headers: " + error.message });
    }
  });

  // Platform statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      // Mock statistics for now - in production these would come from the database
      const stats = {
        questionsAnswered: 15247,
        securityExperts: "5 AI Models",
        responseTime: "< 30 seconds",
        accuracyRate: "98.5%"
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching statistics: " + error.message });
    }
  });

  // PayPal Routes (simplified version for demo)
  app.post("/api/paypal/order", async (req, res) => {
    try {
      const { intent, amount, currency } = req.body;
      
      // In a real implementation, you would use PayPal SDK here
      // For now, return a mock response structure
      const mockOrder = {
        id: `PAYPAL_ORDER_${Date.now()}`,
        status: "CREATED",
        links: [
          {
            href: `${req.protocol}://${req.get('host')}/api/paypal/success?token=MOCK_TOKEN&PayerID=MOCK_PAYER`,
            rel: "approve",
            method: "GET"
          }
        ]
      };
      
      res.json(mockOrder);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating PayPal order: " + error.message });
    }
  });

  app.get("/api/paypal/success", async (req, res) => {
    try {
      // In real implementation, capture the PayPal payment here
      res.redirect("/?payment=success&method=paypal");
    } catch (error: any) {
      res.redirect("/?payment=error");
    }
  });

  app.get("/api/paypal/cancel", async (req, res) => {
    res.redirect("/?payment=cancelled");
  });

  const httpServer = createServer(app);
  return httpServer;
}
