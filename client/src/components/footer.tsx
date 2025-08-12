import { Heart, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";

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
                href="#" 
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white focus-ring rounded-md p-1" 
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Find Specialists
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white focus-ring rounded-md">
                  Accessibility
                </a>
              </li>
              <li>
                <a 
                  href="tel:1-800-255-3749" 
                  className="text-gray-300 hover:text-white focus-ring rounded-md flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-ALLERGY
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 AllergyBooking. All rights reserved. | HIPAA Compliant</p>
        </div>
      </div>
    </footer>
  );
}
