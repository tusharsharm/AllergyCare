import { type Doctor, type InsertDoctor, type Appointment, type InsertAppointment, type TimeSlot, type InsertTimeSlot } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Doctor methods
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  searchDoctors(query: string): Promise<Doctor[]>;
  
  // Appointment methods
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  
  // Time slot methods
  getTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]>;
  getAvailableTimeSlots(doctorId: string, date: string): Promise<TimeSlot[]>;
  updateTimeSlotAvailability(id: string, isAvailable: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private doctors: Map<string, Doctor>;
  private appointments: Map<string, Appointment>;
  private timeSlots: Map<string, TimeSlot>;

  constructor() {
    this.doctors = new Map();
    this.appointments = new Map();
    this.timeSlots = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize doctors
    const doctorsData: Doctor[] = [
      {
        id: "dr-smith",
        firstName: "Sarah",
        lastName: "Smith",
        specialty: "Food Allergy Specialist",
        clinic: "Downtown Medical Center",
        location: "Downtown Medical Center",
        distance: "0.8 miles",
        rating: 48,
        reviewCount: 124,
        initials: "DS",
        avatarColor: "#1565C0"
      },
      {
        id: "dr-johnson",
        firstName: "Michael",
        lastName: "Johnson",
        specialty: "Environmental Allergies",
        clinic: "Westside Clinic",
        location: "Westside Clinic",
        distance: "1.2 miles",
        rating: 46,
        reviewCount: 89,
        initials: "MJ",
        avatarColor: "#2E7D32"
      },
      {
        id: "dr-patel",
        firstName: "Anita",
        lastName: "Patel",
        specialty: "Pediatric Allergist",
        clinic: "Children's Medical Group",
        location: "Children's Medical Group",
        distance: "0.5 miles",
        rating: 49,
        reviewCount: 156,
        initials: "AP",
        avatarColor: "#E65100"
      }
    ];

    doctorsData.forEach(doctor => {
      this.doctors.set(doctor.id, doctor);
    });

    // Initialize time slots for the next 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends for this demo
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const times = [
        "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
        "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
        "4:00 PM", "4:30 PM"
      ];
      
      doctorsData.forEach(doctor => {
        times.forEach(time => {
          const slotId = randomUUID();
          this.timeSlots.set(slotId, {
            id: slotId,
            doctorId: doctor.id,
            date: dateStr,
            time,
            isAvailable: Math.random() > 0.3 // 70% availability
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
      doctor.clinic.toLowerCase().includes(lowercaseQuery)
    );
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
      createdAt: new Date()
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
