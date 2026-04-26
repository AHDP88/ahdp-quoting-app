import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertQuoteSchema, insertMaterialSchema, insertAddonSchema, insertLabourRateSchema } from "@shared/schema";
import { registerSettingsRoutes } from "./settingsRoutes";
import { calculateQuoteTotals } from "./quoteCalculation";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== MATERIAL ROUTES =====
  app.get("/api/pricing/materials", async (_req, res) => {
    try {
      const materials = await storage.getActiveMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve materials" });
    }
  });

  app.post("/api/pricing/materials", async (req, res) => {
    try {
      const materialData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(materialData);
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid material data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create material" });
      }
    }
  });

  app.patch("/api/pricing/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid material ID" });

      const materialData = insertMaterialSchema.partial().parse(req.body);
      const material = await storage.updateMaterial(id, materialData);
      
      if (!material) return res.status(404).json({ message: "Material not found" });
      res.json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid material data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update material" });
      }
    }
  });

  app.delete("/api/pricing/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid material ID" });

      const deleted = await storage.deleteMaterial(id);
      if (!deleted) return res.status(404).json({ message: "Material not found" });
      res.json({ message: "Material deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete material" });
    }
  });

  // ===== ADDON ROUTES =====
  app.get("/api/pricing/addons", async (_req, res) => {
    try {
      const addons = await storage.getActiveAddons();
      res.json(addons);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve addons" });
    }
  });

  app.post("/api/pricing/addons", async (req, res) => {
    try {
      const addonData = insertAddonSchema.parse(req.body);
      const addon = await storage.createAddon(addonData);
      res.status(201).json(addon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid addon data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create addon" });
      }
    }
  });

  app.patch("/api/pricing/addons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid addon ID" });

      const addonData = insertAddonSchema.partial().parse(req.body);
      const addon = await storage.updateAddon(id, addonData);
      
      if (!addon) return res.status(404).json({ message: "Addon not found" });
      res.json(addon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid addon data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update addon" });
      }
    }
  });

  app.delete("/api/pricing/addons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid addon ID" });

      const deleted = await storage.deleteAddon(id);
      if (!deleted) return res.status(404).json({ message: "Addon not found" });
      res.json({ message: "Addon deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete addon" });
    }
  });

  // ===== LABOUR RATE ROUTES =====
  app.get("/api/pricing/labour-rates", async (_req, res) => {
    try {
      const rates = await storage.getActiveLabourRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve labour rates" });
    }
  });

  app.post("/api/pricing/labour-rates", async (req, res) => {
    try {
      const rateData = insertLabourRateSchema.parse(req.body);
      const rate = await storage.createLabourRate(rateData);
      res.status(201).json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid labour rate data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create labour rate" });
      }
    }
  });

  app.patch("/api/pricing/labour-rates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid labour rate ID" });

      const rateData = insertLabourRateSchema.partial().parse(req.body);
      const rate = await storage.updateLabourRate(id, rateData);
      
      if (!rate) return res.status(404).json({ message: "Labour rate not found" });
      res.json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid labour rate data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update labour rate" });
      }
    }
  });

  app.delete("/api/pricing/labour-rates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid labour rate ID" });

      const deleted = await storage.deleteLabourRate(id);
      if (!deleted) return res.status(404).json({ message: "Labour rate not found" });
      res.json({ message: "Labour rate deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete labour rate" });
    }
  });
  // Calculate quote totals from raw inputs. Pricing is resolved server-side from pricing_items.
  app.post("/api/quotes/calculate", async (req, res) => {
    try {
      const calculation = await calculateQuoteTotals(req.body);
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate quote" });
    }
  });

  // Create a new quote
  app.post("/api/quotes", async (req, res) => {
    try {
      const calculation = await calculateQuoteTotals(req.body);
      const quoteData = insertQuoteSchema.parse({
        ...req.body,
        totalAmount: calculation.totalAmount,
        totalAmountInc: calculation.totalAmountInc,
      });
      const quote = await storage.createQuote(quoteData);

      // Auto-generate and persist a human-readable quote reference (AHDP-YYYY-NNNN)
      if (!quote.quoteReference) {
        const year = new Date().getFullYear();
        const ref = `AHDP-${year}-${String(quote.id).padStart(4, "0")}`;
        const updated = await storage.updateQuote(quote.id, {
          ...quoteData,
          quoteReference: ref,
        });
        return res.status(201).json(updated || quote);
      }

      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create quote" });
      }
    }
  });

  // Get a specific quote by ID
  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      
      const quote = await storage.getQuote(id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve quote" });
    }
  });

  // Get all quotes
  app.get("/api/quotes", async (_req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve quotes" });
    }
  });

  // Update a quote
  app.patch("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }

      const calculation = await calculateQuoteTotals(req.body);
      const quoteData = insertQuoteSchema.parse({
        ...req.body,
        totalAmount: calculation.totalAmount,
        totalAmountInc: calculation.totalAmountInc,
      });
      const quote = await storage.updateQuote(id, quoteData);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update quote" });
      }
    }
  });

  // Update quote status — lightweight lifecycle transition
  app.patch("/api/quotes/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid quote ID" });

      const { status } = z.object({ status: z.enum(["draft", "sent", "approved", "declined"]) }).parse(req.body);

      const timestampField: Record<string, string> = {
        sent:     "sentAt",
        approved: "approvedAt",
        declined: "declinedAt",
      };

      const patch: Record<string, unknown> = { status };
      if (timestampField[status]) patch[timestampField[status]] = new Date();

      // Auto-calculate deposit (20% of inc-GST total) on approval
      if (status === "approved") {
        const existing = await storage.getQuote(id);
        if (existing?.totalAmountInc && !existing.depositAmount) {
          patch.depositAmount = Math.round(existing.totalAmountInc * 0.2);
        }
      }

      const quote = await storage.patchQuote(id, patch);
      if (!quote) return res.status(404).json({ message: "Quote not found" });
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid status", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update status" });
      }
    }
  });

  // Update job handover fields (post-approval)
  app.patch("/api/quotes/:id/job", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid quote ID" });

      const schema = z.object({
        depositPaid:        z.boolean().optional(),
        depositAmount:      z.number().int().optional(),
        siteInspectionDate: z.string().optional(),
        estimatedStartDate: z.string().optional(),
        assignedTo:         z.string().optional(),
        followUpDate:       z.string().optional(),
        jobReference:       z.string().optional(),
      });

      const data = schema.parse(req.body);
      const quote = await storage.patchQuote(id, data);
      if (!quote) return res.status(404).json({ message: "Quote not found" });
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update job handover" });
      }
    }
  });

  // CRM export — structured payload for Airtable / webhook integration
  app.get("/api/quotes/:id/crm-export", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid quote ID" });

      const quote = await storage.getQuote(id);
      if (!quote) return res.status(404).json({ message: "Quote not found" });

      const payload = {
        quoteReference:     quote.quoteReference,
        status:             quote.status,
        projectType:        quote.projectType,
        clientName:         quote.clientName,
        clientEmail:        quote.clientEmail,
        clientPhone:        quote.clientPhone,
        siteAddress:        quote.siteAddress,
        scope:              quote.scopeSummaryText,
        totalExGST:         quote.totalAmount ? (quote.totalAmount / 100).toFixed(2) : null,
        totalIncGST:        quote.totalAmountInc ? (quote.totalAmountInc / 100).toFixed(2) : null,
        depositAmount:      quote.depositAmount ? (quote.depositAmount / 100).toFixed(2) : null,
        depositPaid:        quote.depositPaid ?? false,
        assignedTo:         quote.assignedTo,
        siteInspectionDate: quote.siteInspectionDate,
        estimatedStartDate: quote.estimatedStartDate,
        followUpDate:       quote.followUpDate,
        jobReference:       quote.jobReference,
        createdAt:          quote.createdAt,
        sentAt:             quote.sentAt,
        approvedAt:         quote.approvedAt,
        declinedAt:         quote.declinedAt,
        // Structural specs
        deckingRequired:    quote.deckingRequired,
        deckArea:           quote.length && quote.width ? (parseFloat(quote.length) * parseFloat(quote.width)).toFixed(1) : null,
        deckLength:         quote.length,
        deckWidth:          quote.width,
        deckHeight:         quote.height,
        boardType:          quote.boardType,
        verandahRequired:   quote.verandahRequired,
        roofType:           quote.roofType,
        roofSpan:           quote.roofSpan,
        roofLength:         quote.roofLength,
        councilApproval:    quote.councilApproval,
        constructionAccess: quote.constructionAccess,
        groundConditions:   quote.groundConditions,
        notes:              quote.notes,
      };

      res.json(payload);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate CRM export" });
    }
  });

  // Delete a quote
  app.delete("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }

      const deleted = await storage.deleteQuote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quote" });
    }
  });

  // ===== PRICING SETTINGS ROUTES =====
  registerSettingsRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
