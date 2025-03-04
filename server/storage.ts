import { users, favors, reviews, type User, type InsertUser, type Favor, type InsertFavor, type Review, type InsertReview } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  // Favors
  getFavor(id: number): Promise<Favor | undefined>;
  getFavors(): Promise<Favor[]>;
  getFavorsByCategory(category: string): Promise<Favor[]>;
  createFavor(favor: InsertFavor): Promise<Favor>;
  updateFavorStatus(id: number, status: string, helperId?: number): Promise<Favor>;
  
  // Reviews
  getReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private favors: Map<number, Favor>;
  private reviews: Map<number, Review>;
  private currentIds: { users: number; favors: number; reviews: number };

  constructor() {
    this.users = new Map();
    this.favors = new Map();
    this.reviews = new Map();
    this.currentIds = { users: 1, favors: 1, reviews: 1 };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user = { ...insertUser, id, askedCount: 0, doneCount: 0, earned: "0" };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, update: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...update };
    this.users.set(id, updated);
    return updated;
  }

  async getFavor(id: number): Promise<Favor | undefined> {
    return this.favors.get(id);
  }

  async getFavors(): Promise<Favor[]> {
    return Array.from(this.favors.values());
  }

  async getFavorsByCategory(category: string): Promise<Favor[]> {
    return Array.from(this.favors.values()).filter(
      (favor) => favor.category === category
    );
  }

  async createFavor(insertFavor: InsertFavor): Promise<Favor> {
    const id = this.currentIds.favors++;
    const favor = { ...insertFavor, id, status: "open", helperId: null };
    this.favors.set(id, favor);
    return favor;
  }

  async updateFavorStatus(id: number, status: string, helperId?: number): Promise<Favor> {
    const favor = await this.getFavor(id);
    if (!favor) throw new Error("Favor not found");
    const updated = { ...favor, status, helperId };
    this.favors.set(id, updated);
    return updated;
  }

  async getReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentIds.reviews++;
    const review = { ...insertReview, id };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
