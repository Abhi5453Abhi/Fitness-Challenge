import { pgTable, text, integer, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["PENDING", "VERIFIED", "REJECTED"]);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    coins: integer('coins').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const storeItems = pgTable('store_items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    cost: integer('cost').notNull(),
    imageUrl: text('image_url').notNull(),
    stock: integer('stock').default(-1), // -1 for infinite
    createdAt: timestamp('created_at').defaultNow(),
});

export const workouts = pgTable("workouts", {
    id: serial("id").primaryKey(),
    userName: text("user_name").notNull(),
    videoUrl: text("video_url").notNull(),
    geminiCount: integer("gemini_count").default(0),
    adminCount: integer("admin_count"),
    status: statusEnum("status").default("PENDING"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const redemptions = pgTable("redemptions", {
    id: serial("id").primaryKey(),
    userName: text("user_name").notNull(),
    itemId: integer("item_id").notNull(),
    itemName: text("item_name").notNull(),
    cost: integer("cost").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
