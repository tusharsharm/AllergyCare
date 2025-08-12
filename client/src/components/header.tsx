import { Link, useLocation } from "wouter";
import { Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const NavLinks = ({ mobile = false, onClose = () => {} }) => (
    <ul className={`flex ${mobile ? 'flex-col' : ''} space-x-0 ${mobile ? 'space-y-4' : 'space-x-6'}`}>
      <li>
        <Link 
          href="/" 
          className={`text-lg hover:text-primary focus-ring rounded-md px-2 py-1 ${
            location === "/" ? "text-primary font-medium" : "text-gray-700"
          }`}
          onClick={onClose}
        >
          Home
        </Link>
      </li>
      <li>
        <Link 
          href="/appointments" 
          className={`text-lg hover:text-primary focus-ring rounded-md px-2 py-1 ${
            location === "/appointments" ? "text-primary font-medium" : "text-gray-700"
          }`}
          onClick={onClose}
        >
          My Appointments
        </Link>
      </li>
      <li>
        <a 
          href="#help" 
          className="text-lg text-gray-700 hover:text-primary focus-ring rounded-md px-2 py-1"
          onClick={onClose}
        >
          Help
        </a>
      </li>
    </ul>
  );

  return (
    <header className="bg-white shadow-sm border-b-2 border-primary" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center focus-ring rounded-md">
            <Heart className="text-primary text-2xl mr-3" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-primary">AllergyBooking</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:block">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="focus-ring">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center mb-8">
                <Heart className="text-primary text-xl mr-2" aria-hidden="true" />
                <span className="text-xl font-bold text-primary">AllergyBooking</span>
              </div>
              <nav role="navigation" aria-label="Mobile navigation">
                <NavLinks mobile onClose={() => {}} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
