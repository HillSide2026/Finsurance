import { db } from "./db";
import {
  users,
  chats,
  messages,
  ndas,
  type User,
  type UpsertUser,
  type Chat,
  type Message,
  type Nda,
  type ConsultationStatus,
  type NdaIntake,
  createEmptyNdaIntake,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

type NdaAnswers = Record<string, unknown>;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // Not really used with Replit Auth but kept for interface
  createUser(user: UpsertUser): Promise<User>;

  createChat(userId: string, title?: string): Promise<Chat>;
  getChats(userId: string): Promise<Chat[]>;
  getChat(id: number): Promise<Chat | undefined>;
  updateChatIntake(
    chatId: number,
    intake: NdaIntake,
    status: ConsultationStatus,
  ): Promise<Chat>;
  updateChatStatus(chatId: number, status: ConsultationStatus): Promise<Chat>;
  
  createMessage(chatId: number, role: 'user' | 'assistant', content: string): Promise<Message>;
  getMessages(chatId: number): Promise<Message[]>;

  createNda(userId: string, chatId: number, content: string, answers: NdaAnswers): Promise<Nda>;
  getLatestNdaForChat(chatId: number): Promise<Nda | undefined>;
  getNda(id: number): Promise<Nda | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Replit auth users don't have username in the same way, but email might be unique
    return undefined; 
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createChat(userId: string, title?: string): Promise<Chat> {
    const [chat] = await db
      .insert(chats)
      .values({
        userId,
        title: title || "New Chat",
        status: "intake_in_progress",
        ndaIntake: createEmptyNdaIntake(),
      })
      .returning();
    return chat;
  }

  async getChats(userId: string): Promise<Chat[]> {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt), desc(chats.createdAt));
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat;
  }

  async updateChatIntake(
    chatId: number,
    intake: NdaIntake,
    status: ConsultationStatus,
  ): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set({
        ndaIntake: intake,
        status,
        updatedAt: new Date(),
      })
      .where(eq(chats.id, chatId))
      .returning();
    return chat;
  }

  async updateChatStatus(
    chatId: number,
    status: ConsultationStatus,
  ): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(chats.id, chatId))
      .returning();
    return chat;
  }

  async createMessage(chatId: number, role: 'user' | 'assistant', content: string): Promise<Message> {
    const [message] = await db.insert(messages).values({ chatId, role, content }).returning();
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, chatId));
    return message;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(messages.createdAt);
  }

  async createNda(userId: string, chatId: number, content: string, answers: NdaAnswers): Promise<Nda> {
    const [nda] = await db.insert(ndas).values({ userId, chatId, content, answers }).returning();
    await db
      .update(chats)
      .set({
        status: "draft_generated",
        updatedAt: new Date(),
      })
      .where(eq(chats.id, chatId));
    return nda;
  }

  async getLatestNdaForChat(chatId: number): Promise<Nda | undefined> {
    const [nda] = await db
      .select()
      .from(ndas)
      .where(eq(ndas.chatId, chatId))
      .orderBy(desc(ndas.createdAt), desc(ndas.id));
    return nda;
  }

  async getNda(id: number): Promise<Nda | undefined> {
    const [nda] = await db.select().from(ndas).where(eq(ndas.id, id));
    return nda;
  }
}

export const storage = new DatabaseStorage();
