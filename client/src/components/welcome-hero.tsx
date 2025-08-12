import { CalendarCheck, Shield, Accessibility } from "lucide-react";

export default function WelcomeHero() {
  return (
    <section className="bg-white rounded-lg shadow-md p-8 mb-8" aria-labelledby="welcome-heading">
      <div className="text-center">
        <h2 id="welcome-heading" className="text-3xl font-bold text-gray-900 mb-4">
          Book Your Allergy Specialist Appointment
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          Easy, accessible appointment booking without phone calls or emails. 
          Find the right specialist for your allergies and book instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarCheck className="text-secondary mr-2 h-5 w-5" aria-hidden="true" />
            <span>Instant Booking</span>
          </div>
          <div className="flex items-center">
            <Accessibility className="text-secondary mr-2 h-5 w-5" aria-hidden="true" />
            <span>Fully Accessible</span>
          </div>
          <div className="flex items-center">
            <Shield className="text-secondary mr-2 h-5 w-5" aria-hidden="true" />
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
