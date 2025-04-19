import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { json } from "express";
import { 
  insertUserSchema, 
  insertProfileSchema, 
  insertSkillSchema, 
  insertJourneyItemSchema, 
  insertProjectSchema, 
  insertCertificateSchema, 
  insertMessageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.use("/api", json());

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile(1); // Default user ID
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const parsed = insertProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateProfile(parsed);
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error updating profile" });
      }
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills(1); // Default user ID
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Error fetching skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const parsed = insertSkillSchema.parse(req.body);
      const newSkill = await storage.createSkill(parsed);
      res.status(201).json(newSkill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid skill data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error creating skill" });
      }
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertSkillSchema.parse(req.body);
      const updatedSkill = await storage.updateSkill(id, parsed);
      res.json(updatedSkill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid skill data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error updating skill" });
      }
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting skill" });
    }
  });

  // Journey items routes
  app.get("/api/journey", async (req, res) => {
    try {
      const journeyItems = await storage.getJourneyItems(1); // Default user ID
      res.json(journeyItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching journey items" });
    }
  });

  app.post("/api/journey", async (req, res) => {
    try {
      const parsed = insertJourneyItemSchema.parse(req.body);
      const newItem = await storage.createJourneyItem(parsed);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid journey item data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error creating journey item" });
      }
    }
  });

  app.put("/api/journey/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertJourneyItemSchema.parse(req.body);
      const updatedItem = await storage.updateJourneyItem(id, parsed);
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid journey item data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error updating journey item" });
      }
    }
  });

  app.delete("/api/journey/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJourneyItem(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting journey item" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects(1); // Default user ID
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const parsed = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(parsed);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error creating project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertProjectSchema.parse(req.body);
      const updatedProject = await storage.updateProject(id, parsed);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error updating project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  });

  // Certificates routes
  app.get("/api/certificates", async (req, res) => {
    try {
      const certificates = await storage.getCertificates(1); // Default user ID
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificates" });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const parsed = insertCertificateSchema.parse(req.body);
      const newCertificate = await storage.createCertificate(parsed);
      res.status(201).json(newCertificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid certificate data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error creating certificate" });
      }
    }
  });

  app.put("/api/certificates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertCertificateSchema.parse(req.body);
      const updatedCertificate = await storage.updateCertificate(id, parsed);
      res.json(updatedCertificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid certificate data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error updating certificate" });
      }
    }
  });

  app.delete("/api/certificates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCertificate(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting certificate" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(parsed);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Error creating message" });
      }
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(1); // Default user ID
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedMessage = await storage.markMessageAsRead(id);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Error marking message as read" });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMessage(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting message" });
    }
  });

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
