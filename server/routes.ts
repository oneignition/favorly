import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFavorSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/favors", async (req, res) => {
    const category = req.query.category as string;
    const favors = category 
      ? await storage.getFavorsByCategory(category)
      : await storage.getFavors();
    res.json(favors);
  });

  app.post("/api/favors", async (req, res) => {
    const favorData = insertFavorSchema.parse(req.body);
    const favor = await storage.createFavor(favorData);
    res.json(favor);
  });

  app.post("/api/favors/:id/help", async (req, res) => {
    const { id } = req.params;
    const { helperId } = req.body;
    const favor = await storage.updateFavorStatus(Number(id), "claimed", helperId);
    res.json(favor);
  });

  app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const user = await storage.getUser(Number(id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  app.get("/api/users/:id/reviews", async (req, res) => {
    const { id } = req.params;
    const reviews = await storage.getReviews(Number(id));
    res.json(reviews);
  });

  app.post("/api/reviews", async (req, res) => {
    const reviewData = insertReviewSchema.parse(req.body);
    const review = await storage.createReview(reviewData);
    res.json(review);
  });

  const httpServer = createServer(app);
  return httpServer;
}
