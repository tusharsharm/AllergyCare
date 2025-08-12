import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertUserLocationSchema } from "@shared/schema";
import { z } from "zod";

// Approximate coordinates for major Indian districts/cities
function getApproximateCoordinates(district: string, state: string): { latitude: string, longitude: string } {
  const locationMap: Record<string, { latitude: string, longitude: string }> = {
    // Major cities and districts
    "Mumbai": { latitude: "19.0760", longitude: "72.8777" },
    "Delhi": { latitude: "28.7041", longitude: "77.1025" },
    "Bangalore": { latitude: "12.9716", longitude: "77.5946" },
    "Bengaluru": { latitude: "12.9716", longitude: "77.5946" },
    "Chennai": { latitude: "13.0827", longitude: "80.2707" },
    "Hyderabad": { latitude: "17.3850", longitude: "78.4867" },
    "Pune": { latitude: "18.5204", longitude: "73.8567" },
    "Kolkata": { latitude: "22.5726", longitude: "88.3639" },
    "Ahmedabad": { latitude: "23.0225", longitude: "72.5714" },
    "Surat": { latitude: "21.1702", longitude: "72.8311" },
    "Jaipur": { latitude: "26.9124", longitude: "75.7873" },
    "Lucknow": { latitude: "26.8467", longitude: "80.9462" },
    "Kanpur": { latitude: "26.4499", longitude: "80.3319" },
    "Nagpur": { latitude: "21.1458", longitude: "79.0882" },
    "Indore": { latitude: "22.7196", longitude: "75.8577" },
    "Patna": { latitude: "25.5941", longitude: "85.1376" },
    "Ghaziabad": { latitude: "28.6692", longitude: "77.4538" },
    "Agra": { latitude: "27.1767", longitude: "78.0081" },
    "Varanasi": { latitude: "25.2677", longitude: "82.9739" },
    "Meerut": { latitude: "28.9845", longitude: "77.7064" },
    "Rajkot": { latitude: "22.3039", longitude: "70.8022" },
    "Coimbatore": { latitude: "11.0168", longitude: "76.9558" },
    "Jodhpur": { latitude: "26.2389", longitude: "73.0243" },
    "Madurai": { latitude: "9.9252", longitude: "78.1198" },
    "Gwalior": { latitude: "26.2183", longitude: "78.1828" },
    "Vijayawada": { latitude: "16.5062", longitude: "80.6480" },
    "Mysore": { latitude: "12.2958", longitude: "76.6394" },
    "Bhopal": { latitude: "23.2599", longitude: "77.4126" },
    "Salem": { latitude: "11.6643", longitude: "78.1460" },
    "Warangal": { latitude: "17.9689", longitude: "79.5941" }
  };

  // Try exact district match first
  if (locationMap[district]) {
    return locationMap[district];
  }

  // State-based approximate locations
  const stateApproximates: Record<string, { latitude: string, longitude: string }> = {
    "Maharashtra": { latitude: "19.7515", longitude: "75.7139" },
    "Karnataka": { latitude: "15.3173", longitude: "75.7139" },
    "Tamil Nadu": { latitude: "11.1271", longitude: "78.6569" },
    "Andhra Pradesh": { latitude: "15.9129", longitude: "79.7400" },
    "Telangana": { latitude: "18.1124", longitude: "79.0193" },
    "Kerala": { latitude: "10.8505", longitude: "76.2711" },
    "Gujarat": { latitude: "22.2587", longitude: "71.1924" },
    "Rajasthan": { latitude: "27.0238", longitude: "74.2179" },
    "Madhya Pradesh": { latitude: "22.9734", longitude: "78.6569" },
    "Uttar Pradesh": { latitude: "26.8467", longitude: "80.9462" },
    "West Bengal": { latitude: "22.9868", longitude: "87.8550" },
    "Bihar": { latitude: "25.0961", longitude: "85.3131" },
    "Jharkhand": { latitude: "23.6102", longitude: "85.2799" },
    "Odisha": { latitude: "20.9517", longitude: "85.0985" },
    "Punjab": { latitude: "31.1471", longitude: "75.3412" },
    "Haryana": { latitude: "29.0588", longitude: "76.0856" },
    "Delhi": { latitude: "28.7041", longitude: "77.1025" },
    "Assam": { latitude: "26.2006", longitude: "92.9376" }
  };

  return stateApproximates[state] || { latitude: "20.5937", longitude: "78.9629" };
}

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
