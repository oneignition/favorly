import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  avatar: text("avatar"),
  about: text("about"),
  askedCount: integer("asked_count").default(0),
  doneCount: integer("done_count").default(0),
  earned: decimal("earned").default("0"),
  skills: text("skills").array(),
});

export const favors = pgTable("favors", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: decimal("price").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("open"),
  category: text("category").notNull(),
  when: timestamp("when").notNull(),
  otherCategoryDetail: text("other_category_detail"),
  userId: integer("user_id").notNull(),
  helperId: integer("helper_id"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  userId: integer("user_id").notNull(),
  favorId: integer("favor_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  avatar: true,
  about: true,
  skills: true,
});

export const insertFavorSchema = createInsertSchema(favors).pick({
  title: true,
  price: true,
  location: true,
  category: true,
  when: true,
  otherCategoryDetail: true,
  userId: true,
}).extend({
  category: z.enum(["delivery", "pet-care", "cleaning", "errands", "handyman", "others"]),
  when: z.coerce.date(),
  otherCategoryDetail: z.string().optional(),
});

export const insertReviewSchema = createInsertSchema(reviews);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Favor = typeof favors.$inferSelect;
export type InsertFavor = z.infer<typeof insertFavorSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;