import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFavorSchema, insertReviewSchema } from "@shared/schema";
import { db } from "./firebase";

export async function registerRoutes(app: Express) {
  // Debug endpoint to verify Firebase config
  app.get("/api/debug-firebase-config", (req, res) => {
    try {
      const config = process.env.FIREBASE_CONFIG;
      if (!config) {
        return res.status(500).json({
          error: 'FIREBASE_CONFIG is not set',
          configValid: false
        });
      }

      // Log information about the raw config (safely)
      const configInfo = {
        length: config.length,
        startsWithType: config.startsWith('{"type":"service_account"'),
        hasProjectId: config.includes('"project_id"'),
        hasPrivateKey: config.includes('"private_key"'),
        hasClientEmail: config.includes('"client_email"')
      };

      console.log('Firebase config diagnostic info:', configInfo);

      // Clean and parse
      const cleanConfig = config
        .trim()
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/\\\\n/g, '\\n')
        .replace(/\\n/g, '\n');

      const parsedConfig = JSON.parse(cleanConfig);

      res.json({
        configInfo,
        projectId: parsedConfig.project_id,
        type: parsedConfig.type,
        clientEmail: parsedConfig.client_email,
        hasPrivateKey: !!parsedConfig.private_key,
        configValid: true
      });
    } catch (error: any) {
      console.error('Debug endpoint error:', error);
      res.status(500).json({
        error: 'Failed to parse Firebase config',
        details: error.message,
        configValid: false
      });
    }
  });

  app.get("/api/favors", async (req, res) => {
    try {
      const category = req.query.category as string;
      const favors = category 
        ? await storage.getFavorsByCategory(category)
        : await storage.getFavors();
      res.json(favors);
    } catch (error: any) {
      console.error('Error getting favors:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/favors", async (req, res) => {
    try {
      console.log('Received favor data:', req.body);
      const favorData = insertFavorSchema.parse(req.body);
      console.log('Validated favor data:', favorData);
      const favor = await storage.createFavor(favorData);
      console.log('Created favor:', favor);
      res.json(favor);
    } catch (error: any) {
      console.error('Error creating favor:', error);
      res.status(500).json({ error: error.message });
    }
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