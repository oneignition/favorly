import { db } from './firebase';
import { type User, type InsertUser, type Favor, type InsertFavor, type Review, type InsertReview } from "@shared/schema";
import { type DocumentData } from 'firebase-admin/firestore';

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

export class FirebaseStorage implements IStorage {
  private usersRef = db.collection('users');
  private favorsRef = db.collection('favors');
  private reviewsRef = db.collection('reviews');

  async getUser(id: number): Promise<User | undefined> {
    try {
      const doc = await this.usersRef.doc(id.toString()).get();
      if (!doc.exists) return undefined;
      return { id, ...doc.data() as Omit<User, 'id'> };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = Date.now(); // Simple auto-increment simulation
      const user: User = {
        id,
        ...insertUser,
        askedCount: 0,
        doneCount: 0,
        earned: "0",
        skills: insertUser.skills || [],
        avatar: insertUser.avatar || null,
        about: insertUser.about || null,
      };
      await this.usersRef.doc(id.toString()).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, update: Partial<User>): Promise<User> {
    try {
      const userRef = this.usersRef.doc(id.toString());
      const doc = await userRef.get();
      if (!doc.exists) throw new Error("User not found");

      const updated = { ...doc.data(), ...update } as Omit<User, 'id'>;
      await userRef.update(updated);
      return { id, ...updated };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getFavor(id: number): Promise<Favor | undefined> {
    try {
      const doc = await this.favorsRef.doc(id.toString()).get();
      if (!doc.exists) return undefined;
      return { id, ...doc.data() as Omit<Favor, 'id'> };
    } catch (error) {
      console.error('Error getting favor:', error);
      throw error;
    }
  }

  async getFavors(): Promise<Favor[]> {
    try {
      const snapshot = await this.favorsRef.get();
      return snapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data() as Omit<Favor, 'id'>
      }));
    } catch (error) {
      console.error('Error getting favors:', error);
      throw error;
    }
  }

  async getFavorsByCategory(category: string): Promise<Favor[]> {
    try {
      const snapshot = await this.favorsRef
        .where('category', '==', category)
        .get();
      return snapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data() as Omit<Favor, 'id'>
      }));
    } catch (error) {
      console.error('Error getting favors by category:', error);
      throw error;
    }
  }

  async createFavor(insertFavor: InsertFavor): Promise<Favor> {
    try {
      const id = Date.now(); // Simple auto-increment simulation
      const favor: Favor = {
        id,
        ...insertFavor,
        status: "open",
        helperId: null,
        otherCategoryDetail: insertFavor.otherCategoryDetail || null,
      };
      await this.favorsRef.doc(id.toString()).set(favor);
      return favor;
    } catch (error) {
      console.error('Error creating favor:', error);
      throw error;
    }
  }

  async updateFavorStatus(id: number, status: string, helperId?: number): Promise<Favor> {
    try {
      const favorRef = this.favorsRef.doc(id.toString());
      const doc = await favorRef.get();
      if (!doc.exists) throw new Error("Favor not found");

      const updated = { ...doc.data(), status, helperId } as Omit<Favor, 'id'>;
      await favorRef.update(updated);
      return { id, ...updated };
    } catch (error) {
      console.error('Error updating favor status:', error);
      throw error;
    }
  }

  async getReviews(userId: number): Promise<Review[]> {
    try {
      const snapshot = await this.reviewsRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data() as Omit<Review, 'id'>
      }));
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    try {
      const id = Date.now(); // Simple auto-increment simulation
      const review: Review = {
        id,
        ...insertReview,
        createdAt: new Date(),
      };
      await this.reviewsRef.doc(id.toString()).set(review);
      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
}

export const storage = new FirebaseStorage();