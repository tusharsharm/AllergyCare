import { type Doctor, type InsertDoctor, type Appointment, type InsertAppointment, type TimeSlot, type InsertTimeSlot, type UserLocation, type InsertUserLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Doctor methods
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  searchDoctors(query: string): Promise<Doctor[]>;
  getDoctorsByLocation(latitude: string, longitude: string, radiusKm?: number): Promise<Doctor[]>;
  
  // Appointment methods
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  
  // Time slot methods
  getTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]>;
  getAvailableTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]>;
  updateTimeSlotAvailability(id: string, isAvailable: boolean): Promise<void>;
  
  // Location methods
  saveUserLocation(location: InsertUserLocation): Promise<UserLocation>;
  detectLocationFromPincode(pincode: string): Promise<{latitude: string, longitude: string, city: string, state: string} | null>;
}

export class MemStorage implements IStorage {
  private doctors: Map<string, Doctor>;
  private appointments: Map<string, Appointment>;
  private timeSlots: Map<string, TimeSlot>;
  private userLocations: Map<string, UserLocation>;

  constructor() {
    this.doctors = new Map();
    this.appointments = new Map();
    this.timeSlots = new Map();
    this.userLocations = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize doctors with real Indian specialists
    const doctorsData: Doctor[] = [
      // Mumbai specialists
      {
        id: "dr-mumbai-1",
        firstName: "Rajesh",
        lastName: "Sharma",
        specialty: "Clinical Immunology & Allergy",
        clinic: "Apollo Hospitals Navi Mumbai",
        address: "Plot No. 13, Parsik Hill Road, Sector 23, CBD Belapur",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400614",
        latitude: "19.0330",
        longitude: "73.0297",
        phone: "+91-22-39898999",
        experience: 15,
        qualifications: "MD (Internal Medicine), DM (Clinical Immunology), MRCP (UK)",
        languages: ["Hindi", "English", "Marathi"],
        consultationFee: 1200,
        rating: 47,
        reviewCount: 189,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
          "tuesday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
          "wednesday": ["9:00 AM", "10:00 AM"],
          "thursday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
          "friday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
          "saturday": ["9:00 AM", "10:00 AM"]
        }
      },
      {
        id: "dr-mumbai-2",
        firstName: "Priya",
        lastName: "Desai",
        specialty: "Food Allergy & Asthma Specialist",
        clinic: "Fortis Hospital Mulund",
        address: "Mulund Goregaon Link Rd, Mulund West",
        city: "Mumbai",
        state: "Maharashtra", 
        pincode: "400080",
        latitude: "19.1722",
        longitude: "72.9565",
        phone: "+91-22-61696969",
        experience: 12,
        qualifications: "MD (Pediatrics), Fellowship in Allergy & Immunology",
        languages: ["Hindi", "English", "Gujarati"],
        consultationFee: 1000,
        rating: 45,
        reviewCount: 156,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM"],
          "tuesday": ["10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM"],
          "wednesday": ["10:00 AM", "11:00 AM"],
          "thursday": ["10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM"],
          "friday": ["10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM"]
        }
      },
      // Delhi specialists
      {
        id: "dr-delhi-1",
        firstName: "Amit",
        lastName: "Kumar",
        specialty: "Allergy & Clinical Immunology",
        clinic: "Max Super Speciality Hospital Saket",
        address: "1, 2, Press Enclave Road, Saket",
        city: "Delhi",
        state: "Delhi",
        pincode: "110017",
        latitude: "28.5245",
        longitude: "77.2066",
        phone: "+91-11-26515050",
        experience: 18,
        qualifications: "MBBS, MD (Medicine), DM (Clinical Immunology)",
        languages: ["Hindi", "English", "Punjabi"],
        consultationFee: 1500,
        rating: 48,
        reviewCount: 234,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["9:30 AM", "10:30 AM", "3:00 PM", "4:00 PM"],
          "tuesday": ["9:30 AM", "10:30 AM", "3:00 PM", "4:00 PM"],
          "wednesday": ["9:30 AM", "10:30 AM"],
          "thursday": ["9:30 AM", "10:30 AM", "3:00 PM", "4:00 PM"],
          "friday": ["9:30 AM", "10:30 AM", "3:00 PM", "4:00 PM"],
          "saturday": ["9:30 AM", "10:30 AM"]
        }
      },
      // Bangalore specialists
      {
        id: "dr-bangalore-1",
        firstName: "Sunita",
        lastName: "Reddy",
        specialty: "Pediatric Allergy & Immunology",
        clinic: "Manipal Hospital Bangalore",
        address: "98, Hal Airport Road, Old Airport Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560017",
        latitude: "12.9572",
        longitude: "77.6417",
        phone: "+91-80-25023200",
        experience: 14,
        qualifications: "MD (Pediatrics), Fellowship in Allergy & Immunology (USA)",
        languages: ["English", "Hindi", "Kannada", "Telugu"],
        consultationFee: 1100,
        rating: 46,
        reviewCount: 167,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["10:00 AM", "11:00 AM", "3:30 PM", "4:30 PM"],
          "tuesday": ["10:00 AM", "11:00 AM", "3:30 PM", "4:30 PM"],
          "thursday": ["10:00 AM", "11:00 AM", "3:30 PM", "4:30 PM"],
          "friday": ["10:00 AM", "11:00 AM", "3:30 PM", "4:30 PM"],
          "saturday": ["10:00 AM", "11:00 AM"]
        }
      },
      // Chennai specialists
      {
        id: "dr-chennai-1",
        firstName: "Karthik",
        lastName: "Iyer",
        specialty: "Environmental Allergy & Asthma",
        clinic: "Apollo Hospitals Chennai",
        address: "21, Greams Lane, Off Greams Road",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600006",
        latitude: "13.0649",
        longitude: "80.2619",
        phone: "+91-44-28296000",
        experience: 16,
        qualifications: "MD (Pulmonary Medicine), Fellowship in Allergy & Immunology",
        languages: ["Tamil", "English", "Hindi"],
        consultationFee: 1300,
        rating: 47,
        reviewCount: 198,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["9:00 AM", "10:00 AM", "2:30 PM", "3:30 PM"],
          "tuesday": ["9:00 AM", "10:00 AM", "2:30 PM", "3:30 PM"],
          "wednesday": ["9:00 AM", "10:00 AM"],
          "thursday": ["9:00 AM", "10:00 AM", "2:30 PM", "3:30 PM"],
          "friday": ["9:00 AM", "10:00 AM", "2:30 PM", "3:30 PM"]
        }
      },
      // Hyderabad specialists
      {
        id: "dr-hyderabad-1",
        firstName: "Lakshmi",
        lastName: "Narayana",
        specialty: "Drug Allergy & Food Sensitivity",
        clinic: "KIMS Hospitals Hyderabad",
        address: "1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        latitude: "17.4399",
        longitude: "78.4684",
        phone: "+91-40-44885000",
        experience: 13,
        qualifications: "MD (Internal Medicine), DM (Clinical Immunology)",
        languages: ["Telugu", "Hindi", "English"],
        consultationFee: 1000,
        rating: 45,
        reviewCount: 142,
        isVerified: true,
        profileImage: null,
        availability: {
          "monday": ["10:30 AM", "11:30 AM", "4:00 PM", "5:00 PM"],
          "tuesday": ["10:30 AM", "11:30 AM", "4:00 PM", "5:00 PM"],
          "wednesday": ["10:30 AM", "11:30 AM"],
          "thursday": ["10:30 AM", "11:30 AM", "4:00 PM", "5:00 PM"],
          "friday": ["10:30 AM", "11:30 AM", "4:00 PM", "5:00 PM"],
          "saturday": ["10:30 AM", "11:30 AM"]
        }
      }
    ];

    doctorsData.forEach(doctor => {
      this.doctors.set(doctor.id, doctor);
    });

    // Initialize time slots based on doctor availability
    this.generateTimeSlots(doctorsData);
  }

  private generateTimeSlots(doctors: Doctor[]) {
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      doctors.forEach(doctor => {
        const dayAvailability = doctor.availability[dayName] || [];
        dayAvailability.forEach(time => {
          const slotId = randomUUID();
          this.timeSlots.set(slotId, {
            id: slotId,
            doctorId: doctor.id,
            date: dateStr,
            time,
            isAvailable: Math.random() > 0.2 // 80% availability for realistic booking
          });
        });
      });
    }
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async searchDoctors(query: string): Promise<Doctor[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.doctors.values()).filter(doctor =>
      doctor.firstName.toLowerCase().includes(lowercaseQuery) ||
      doctor.lastName.toLowerCase().includes(lowercaseQuery) ||
      doctor.specialty.toLowerCase().includes(lowercaseQuery) ||
      doctor.clinic.toLowerCase().includes(lowercaseQuery) ||
      doctor.city.toLowerCase().includes(lowercaseQuery) ||
      doctor.state.toLowerCase().includes(lowercaseQuery) ||
      doctor.qualifications.toLowerCase().includes(lowercaseQuery) ||
      doctor.languages.some(lang => lang.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async getDoctorsByLocation(latitude: string, longitude: string, radiusKm: number = 50): Promise<Doctor[]> {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    
    return Array.from(this.doctors.values())
      .filter(doctor => doctor.latitude && doctor.longitude)
      .map(doctor => {
        const distance = this.calculateDistance(
          userLat, userLon,
          parseFloat(doctor.latitude!),
          parseFloat(doctor.longitude!)
        );
        return { ...doctor, calculatedDistance: distance };
      })
      .filter(doctor => doctor.calculatedDistance <= radiusKm)
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  }

  async saveUserLocation(location: InsertUserLocation): Promise<UserLocation> {
    const id = randomUUID();
    const userLocation: UserLocation = {
      ...location,
      id,
      createdAt: new Date()
    };
    this.userLocations.set(id, userLocation);
    return userLocation;
  }

  // Simulate pincode-based location detection (in real app, use external API)
  async detectLocationFromPincode(pincode: string): Promise<{latitude: string, longitude: string, city: string, state: string} | null> {
    const pincodeMapping: {[key: string]: {lat: string, lng: string, city: string, state: string}} = {
      "400614": {lat: "19.0330", lng: "73.0297", city: "Mumbai", state: "Maharashtra"},
      "400080": {lat: "19.1722", lng: "72.9565", city: "Mumbai", state: "Maharashtra"},
      "110017": {lat: "28.5245", lng: "77.2066", city: "Delhi", state: "Delhi"},
      "560017": {lat: "12.9572", lng: "77.6417", city: "Bangalore", state: "Karnataka"},
      "600006": {lat: "13.0649", lng: "80.2619", city: "Chennai", state: "Tamil Nadu"},
      "500016": {lat: "17.4399", lng: "78.4684", city: "Hyderabad", state: "Telangana"},
      // Add more pincodes as needed
      "110001": {lat: "28.6139", lng: "77.2090", city: "Delhi", state: "Delhi"},
      "400001": {lat: "18.9322", lng: "72.8264", city: "Mumbai", state: "Maharashtra"},
      "560001": {lat: "12.9716", lng: "77.5946", city: "Bangalore", state: "Karnataka"},
      "600001": {lat: "13.0827", lng: "80.2707", city: "Chennai", state: "Tamil Nadu"},
      "500001": {lat: "17.3850", lng: "78.4867", city: "Hyderabad", state: "Telangana"}
    };

    const location = pincodeMapping[pincode];
    if (location) {
      return {
        latitude: location.lat,
        longitude: location.lng,
        city: location.city,
        state: location.state
      };
    }
    return null;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "confirmed",
      createdAt: new Date(),
      insurance: insertAppointment.insurance || null,
      symptoms: insertAppointment.symptoms || null,
      emergencyContactName: insertAppointment.emergencyContactName || null,
      emergencyContactPhone: insertAppointment.emergencyContactPhone || null,
      emergencyContactRelationship: insertAppointment.emergencyContactRelationship || null
    };
    this.appointments.set(id, appointment);
    
    // Mark time slot as unavailable
    const timeSlot = Array.from(this.timeSlots.values()).find(slot =>
      slot.doctorId === appointment.doctorId &&
      slot.date === appointment.appointmentDate &&
      slot.time === appointment.appointmentTime
    );
    if (timeSlot) {
      await this.updateTimeSlotAvailability(timeSlot.id, false);
    }
    
    return appointment;
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.doctorId === doctorId
    );
  }

  async getTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values()).filter(
      slot => slot.doctorId === doctorId && slot.date === date
    );
  }

  async getAvailableTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values()).filter(
      slot => slot.doctorId === doctorId && slot.date === date && slot.isAvailable
    );
  }

  async updateTimeSlotAvailability(id: string, isAvailable: boolean): Promise<void> {
    const timeSlot = this.timeSlots.get(id);
    if (timeSlot) {
      this.timeSlots.set(id, { ...timeSlot, isAvailable });
    }
  }
}

export const storage = new MemStorage();
