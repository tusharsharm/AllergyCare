import { Heart, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="text-primary text-xl mr-2" aria-hidden="true" />
              <h3 className="text-lg font-semibold">AllergyBooking</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Making allergy specialist appointments accessible and easy for everyone.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/HealthMinistryIndia" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="Follow Health Ministry India on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/MoHFW_INDIA" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="Follow Ministry of Health India on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/ministry-of-health-and-family-welfare-government-of-india" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="Follow Ministry of Health India on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  My Appointments
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.apollohospitals.com/about-us" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white focus-ring rounded-md"
                >
                  About Healthcare Partners
                </a>
              </li>
              <li>
                <a 
                  href="https://www.medindia.net/patients/patientrights/patient-rights-india.htm"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white focus-ring rounded-md"
                >
                  Patient Rights India
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.nhp.gov.in/patient-rights_pg" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white focus-ring rounded-md"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@allergybooking.in" 
                  className="text-gray-300 hover:text-white focus-ring rounded-md flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white focus-ring rounded-md"
                >
                  Accessibility Guide
                </a>
              </li>
              <li>
                <a 
                  href="tel:+91-1800-123-4567" 
                  className="text-gray-300 hover:text-white focus-ring rounded-md flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  +91-1800-123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 AllergyBooking India. All rights reserved. | Compliant with Indian Healthcare Standards</p>
        </div>
      </div>
    </footer>
  );
}
