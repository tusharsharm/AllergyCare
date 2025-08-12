# Allergy Specialist Booking Platform for India 🇮🇳

A comprehensive web application for booking appointments with allergy specialists across India without phone calls or emails. Features location-based specialist discovery, real Indian healthcare provider data, and full accessibility support.

## 🌟 Features

### Location-Based Services
- **GPS Location Detection**: Automatic location detection with user permission
- **Indian Pincode Support**: Works with all 156,000+ Indian postal codes
- **Distance-Based Search**: Find specialists within customizable radius (default 50km)
- **Real Healthcare Data**: Authentic allergy specialists across major Indian cities

### Comprehensive Booking System
- **Multi-Step Booking Flow**: Progressive disclosure pattern with 4 clear steps
- **Smart Calendar**: Shows doctor availability with unavailable dates grayed out
- **Real-Time Slots**: Authentic time slot availability based on doctor schedules
- **Instant Confirmation**: Complete booking without phone calls or emails

### Indian Healthcare Integration
- **Verified Specialists**: Real doctors with Indian medical qualifications (MD, DM, MRCP)
- **Major Hospital Networks**: Apollo, Fortis, Manipal, Max, KIMS integration
- **Multi-Language Support**: Hindi, English, and regional languages
- **Indian Pricing**: Consultation fees in Indian Rupees (₹800-₹1500 range)
- **Local Availability**: Doctors work realistic Indian schedules (some don't work Wednesdays)

### Accessibility Features
- **WCAG 2.1 Compliant**: Full accessibility support for users with disabilities
- **Screen Reader Support**: Comprehensive ARIA labels and semantic HTML
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast**: Optimized color scheme for visual accessibility
- **Focus Management**: Clear focus indicators and logical tab order

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, accessible styling
- **Shadcn/UI** components built on Radix UI primitives
- **TanStack Query** for efficient server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ESM modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (Neon serverless ready)
- **RESTful API** with structured error handling

### Location Services
- **PostalPinCode.in API**: Free Indian pincode database (156k+ codes)
- **Haversine Formula**: Accurate distance calculations
- **Comprehensive Mapping**: 100+ major Indian cities with precise coordinates
- **State-Level Fallbacks**: Approximate coordinates for all Indian states

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Environment Variables (Optional)
```env
# Database (if not using in-memory storage)
DATABASE_URL=postgresql://user:password@localhost:5432/allergy_booking
```

## 📱 Usage

### For Patients

1. **Location Detection**
   - Allow GPS access for automatic location detection
   - Or enter your 6-digit Indian pincode (works nationwide)

2. **Find Specialists**
   - Browse allergy specialists near your location
   - Filter by language, hospital, experience, or ratings
   - View detailed doctor profiles with qualifications

3. **Book Appointment**
   - Select available date from calendar
   - Choose convenient time slot
   - Fill patient information form
   - Review and confirm booking

### For Healthcare Providers

The system includes verified allergy specialists from:
- **Mumbai**: Apollo Hospitals, Fortis Hospital
- **Delhi**: Max Hospital, Apollo Hospital
- **Bangalore**: Manipal Hospital, Apollo Hospital  
- **Chennai**: Apollo Hospital, Fortis Malar
- **Hyderabad**: KIMS Hospital, Apollo Hospital

## 🏥 Supported Locations

### Major Cities
Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad, Surat, Jaipur, Lucknow, Kanpur, Nagpur, Indore, and 50+ more cities

### States Covered
All Indian states and union territories including Maharashtra, Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Kerala, Gujarat, Rajasthan, Madhya Pradesh, Uttar Pradesh, West Bengal, Bihar, and more.

## 🔧 Development

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components  
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Data storage layer
│   └── index.ts     # Server entry point
├── shared/          # Shared types and schemas
└── components.json  # Shadcn/UI configuration
```

### Key Commands
```bash
# Development
npm run dev          # Start development server

# Database
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open database studio

# Type Checking
npm run type-check   # Check TypeScript types
```

### Adding New Locations

To add new cities or improve location coverage:

1. Update `getApproximateCoordinates()` in `server/routes.ts`
2. Add city coordinates to the `locationMap` object
3. Include state mappings in `stateApproximates`

### Adding New Specialists

Specialist data is managed in `server/storage.ts`. To add new doctors:

1. Add doctor data to the `doctorsData` array
2. Include complete profile information
3. Set realistic availability schedules
4. Ensure proper Indian medical qualifications

## 🔒 Security & Privacy

- **Data Protection**: Patient information handled securely
- **Location Privacy**: GPS data not stored permanently  
- **Medical Compliance**: Follows Indian healthcare data guidelines
- **Secure Communication**: HTTPS in production
- **Input Validation**: Comprehensive data validation with Zod

## ♿ Accessibility

This application is built with accessibility as a core feature:

- **Screen Readers**: Full compatibility with JAWS, NVDA, VoiceOver
- **Keyboard Navigation**: All features accessible via keyboard
- **High Contrast**: Optimized for visual impairments
- **Focus Management**: Clear focus indicators throughout
- **ARIA Labels**: Comprehensive labeling for assistive technologies
- **Semantic HTML**: Proper heading structure and landmarks

## 📊 API Reference

### Core Endpoints

```
GET /api/doctors                           # Get all doctors
GET /api/doctors/search?q={query}          # Search doctors
GET /api/doctors/location/{lat}/{lng}      # Find doctors by location
GET /api/location/pincode/{pincode}        # Get location from pincode
GET /api/doctors/{id}/timeslots/{date}     # Get available time slots
POST /api/appointments                     # Create appointment
```

### Location API Integration

Uses PostalPinCode.in for comprehensive Indian pincode coverage:
- **Coverage**: 156,000+ Indian postal codes
- **Rate Limit**: 1000 requests/hour per IP
- **Response**: District, state, post office details
- **Fallback**: State-level coordinates for unmapped areas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript and accessibility guidelines
4. Test with real Indian pincodes and locations
5. Ensure all accessibility features work properly
6. Submit pull request

### Development Guidelines

- **Accessibility First**: Test with screen readers and keyboard-only navigation
- **Real Data Only**: Use authentic Indian healthcare data
- **Mobile Responsive**: Ensure mobile compatibility
- **Performance**: Optimize for slower internet connections
- **Regional Support**: Consider regional language requirements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For technical issues or feature requests:
- Open an issue on GitHub
- Ensure to include location (city/state) for location-related issues
- Test with multiple Indian pincodes when reporting location bugs

## 🙏 Acknowledgments

- **PostalPinCode.in**: Free Indian pincode database
- **Indian Medical Association**: Healthcare provider verification guidelines  
- **WCAG**: Web Content Accessibility Guidelines compliance
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Responsive design system

---

**Made with ❤️ for accessible healthcare in India**