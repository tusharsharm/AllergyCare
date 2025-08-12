import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertUserLocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Search doctors
  app.get("/api/doctors/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const doctors = await storage.searchDoctors(query);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to search doctors" });
    }
  });

  // Get specific doctor
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Get doctors by location
  app.get("/api/doctors/location/:latitude/:longitude", async (req, res) => {
    try {
      const { latitude, longitude } = req.params;
      const radius = req.query.radius ? parseInt(req.query.radius as string) : 50;
      
      const doctors = await storage.getDoctorsByLocation(latitude, longitude, radius);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors by location" });
    }
  });

  // Detect location from pincode
  app.get("/api/location/pincode/:pincode", async (req, res) => {
    try {
      const { pincode } = req.params;
      const location = await storage.detectLocationFromPincode(pincode);
      
      if (!location) {
        return res.status(404).json({ message: "Location not found for this pincode" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to detect location" });
    }
  });

  // Save user location
  app.post("/api/location", async (req, res) => {
    try {
      const validatedData = insertUserLocationSchema.parse(req.body);
      const location = await storage.saveUserLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid location data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to save location" });
    }
  });

  // Get available time slots for a doctor on a specific date
  app.get("/api/doctors/:doctorId/timeslots/:date", async (req, res) => {
    try {
      const { doctorId, date } = req.params;
      const timeSlots = await storage.getAvailableTimeSlots(doctorId, date);
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Verify doctor exists
      const doctor = await storage.getDoctor(validatedData.doctorId);
      if (!doctor) {
        return res.status(400).json({ message: "Invalid doctor selected" });
      }

      // Verify time slot is available
      const timeSlots = await storage.getAvailableTimeSlots(
        validatedData.doctorId,
        validatedData.appointmentDate
      );
      const isTimeAvailable = timeSlots.some(slot => slot.time === validatedData.appointmentTime);
      
      if (!isTimeAvailable) {
        return res.status(400).json({ message: "Selected time slot is no longer available" });
      }

      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid appointment data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Get specific appointment
  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
