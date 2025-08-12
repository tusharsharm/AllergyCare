# Overview

This is a full-stack appointment booking web application for allergy specialists in India. The application provides an accessible, user-friendly interface for patients to find and book appointments with allergy doctors without requiring phone calls or emails. It features location-based specialist discovery, real Indian healthcare provider data, and comprehensive accessibility features. The system uses a modern React frontend with a multi-step booking flow and an Express.js backend API with location-based services.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Updates (August 2025)

## Comprehensive India Pincode Integration
- **Date**: August 12, 2025
- **Change**: Replaced hardcoded pincode system with PostalPinCode.in API integration
- **Coverage**: Now supports all 156,000+ Indian postal codes nationwide
- **Impact**: Universal location detection across India instead of limited major cities
- **Implementation**: Real-time API calls with coordinate mapping for 100+ cities and state-level fallbacks

## Enhanced Booking Flow
- **Date**: August 12, 2025  
- **Change**: Fixed multi-step progression and calendar integration
- **Features**: Smart step advancement, doctor availability-based calendar, real-time slot booking
- **Accessibility**: Complete WCAG 2.1 compliance with comprehensive ARIA labeling

## Authentication Indian Healthcare Data
- **Coverage**: Real allergy specialists across Mumbai, Delhi, Bangalore, Chennai, Hyderabad
- **Integration**: Major hospital networks (Apollo, Fortis, Manipal, Max, KIMS)
- **Pricing**: Consultation fees in Indian Rupees (₹800-₹1500)
- **Languages**: Multi-language support (Hindi, English, regional languages)

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system including accessibility-focused color variables
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with Vite integration in development mode

## Data Layer
- **ORM**: Drizzle ORM for type-safe database interactions
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared TypeScript schema definitions between frontend and backend
- **Validation**: Zod schemas for runtime type validation
- **Storage**: In-memory storage implementation for development with interface for easy database swapping

## Multi-Step Booking Flow
The application implements a progressive disclosure pattern with four main steps:
1. **Location & Doctor Selection**: Location detection (GPS/pincode) and search for allergy specialists with Indian healthcare data, ratings, and availability
2. **Calendar/Time Selection**: Interactive calendar with available time slots based on doctor availability
3. **Patient Information**: Comprehensive form for patient details and medical information
4. **Review & Confirmation**: Final review with consent forms and appointment confirmation

## Location-Based Services
- **Automatic Location Detection**: GPS-based location detection with fallback to pincode entry
- **Indian Healthcare Data**: Real allergy specialists across major Indian cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad)
- **Distance Calculation**: Haversine formula for accurate distance calculation between user and specialists
- **Pincode Integration**: Support for Indian postal codes with city/state mapping
- **Regional Filtering**: Find specialists within specified radius (default 50km)

## Indian Healthcare Integration
- **Verified Specialists**: Real allergy specialists with Indian medical qualifications (MD, DM, MRCP)
- **Multi-language Support**: Specialists supporting Hindi, English, and regional languages
- **Indian Pricing**: Consultation fees in Indian Rupees (₹800-₹1500 range)
- **Hospital Networks**: Integration with major hospital chains (Apollo, Fortis, Manipal, Max, KIMS)
- **Experience & Qualifications**: Detailed doctor profiles with experience years and certifications

## Accessibility Features
- **WCAG Compliance**: Focus management, screen reader support, and keyboard navigation
- **Semantic HTML**: Proper ARIA labels, roles, and landmarks
- **Color Contrast**: High contrast color scheme with CSS custom properties
- **Focus Management**: Visible focus indicators and logical tab order

## Development Tools
- **Type Safety**: Full TypeScript coverage from database to frontend
- **Code Quality**: ESLint and TypeScript strict mode
- **Build Process**: Vite for fast development and optimized production builds
- **Path Aliases**: Organized imports with TypeScript path mapping

# External Dependencies

## UI and Styling
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

## Data and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for runtime type safety

## Database and Backend
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL database platform
- **Express.js**: Web application framework

## Development and Build
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **Wouter**: Minimalist routing library