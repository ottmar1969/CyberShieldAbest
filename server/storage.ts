import { users, chatSessions, chatMessages, toolUsage, type User, type InsertUser, type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage, type ToolUsage, type InsertToolUsage } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: string): Promise<User>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User>;
  
  // Chat sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: number): Promise<ChatSession[]>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getSessionMessages(sessionId: number): Promise<ChatMessage[]>;
  
  // Tool usage
  createToolUsage(usage: InsertToolUsage): Promise<ToolUsage>;
  getUserToolUsage(userId: number): Promise<ToolUsage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatSessions: Map<number, ChatSession>;
  private chatMessages: Map<number, ChatMessage>;
  private toolUsage: Map<number, ToolUsage>;
  private userIdCounter: number = 1;
  private sessionIdCounter: number = 1;
  private messageIdCounter: number = 1;
  private toolUsageIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.toolUsage = new Map();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...insertUser,
      id,
      credits: "0.00",
      stripeCustomerId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: number, credits: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, credits };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.sessionIdCounter++;
    const session: ChatSession = {
      id,
      sessionId: insertSession.sessionId,
      userId: insertSession.userId || null,
      createdAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return Array.from(this.chatSessions.values()).find(session => session.sessionId === sessionId);
  }

  async getUserChatSessions(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageIdCounter++;
    const message: ChatMessage = {
      id,
      sessionId: insertMessage.sessionId || null,
      userId: insertMessage.userId || null,
      role: insertMessage.role,
      content: insertMessage.content,
      metadata: insertMessage.metadata || null,
      cost: insertMessage.cost || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getSessionMessages(sessionId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createToolUsage(insertUsage: InsertToolUsage): Promise<ToolUsage> {
    const id = this.toolUsageIdCounter++;
    const usage: ToolUsage = {
      id,
      userId: insertUsage.userId || null,
      toolName: insertUsage.toolName,
      input: insertUsage.input,
      result: insertUsage.result || null,
      createdAt: new Date(),
    };
    this.toolUsage.set(id, usage);
    return usage;
  }

  async getUserToolUsage(userId: number): Promise<ToolUsage[]> {
    return Array.from(this.toolUsage.values())
      .filter(usage => usage.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
