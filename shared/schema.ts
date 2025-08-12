import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  specialty: text("specialty").notNull(),
  clinic: text("clinic").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  phone: text("phone").notNull(),
  experience: integer("experience").notNull(),
  qualifications: text("qualifications").notNull(),
  languages: json("languages").$type<string[]>().default([]),
  consultationFee: integer("consultation_fee").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  profileImage: text("profile_image"),
  availability: json("availability").$type<{[key: string]: string[]}>().default({}),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id),
  patientFirstName: text("patient_first_name").notNull(),
  patientLastName: text("patient_last_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  patientPhone: text("patient_phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  insurance: text("insurance"),
  allergies: text("allergies").notNull(),
  symptoms: text("symptoms"),
  visitReasons: json("visit_reasons").$type<string[]>().default([]),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelationship: text("emergency_contact_relationship"),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const timeSlots = pgTable("time_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
});

// Location schema for user location detection
export const userLocation = pgTable("user_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("India"),
  pincode: text("pincode"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserLocationSchema = createInsertSchema(userLocation).omit({
  id: true,
  createdAt: true,
});

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertUserLocation = z.infer<typeof insertUserLocationSchema>;
export type UserLocation = typeof userLocation.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
