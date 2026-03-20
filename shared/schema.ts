export * from "./models/auth";
export * from "./nda-intake";
import { pgTable, text, serial, integer, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./models/auth";
import {
  type ConsultationStatus,
  type NdaIntake,
  createEmptyNdaIntake,
} from "./nda-intake";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: text("title"),
  status: text("status")
    .$type<ConsultationStatus>()
    .notNull()
    .default("intake_in_progress"),
  ndaIntake: jsonb("nda_intake")
    .$type<NdaIntake>()
    .notNull()
    .default(createEmptyNdaIntake()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ndas = pgTable("ndas", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  chatId: integer("chat_id").references(() => chats.id),
  content: text("content").notNull(),
  answers: jsonb("answers"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertNdaSchema = createInsertSchema(ndas).omit({ id: true, createdAt: true });

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Nda = typeof ndas.$inferSelect;
