import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, MapPin, CheckCircle } from "lucide-react";
import type { Doctor } from "@shared/schema";

interface DoctorSelectionProps {
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  isActive: boolean;
}

export default function DoctorSelection({ 
  selectedDoctor, 
  onDoctorSelect, 
  isActive 
}: DoctorSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: searchQuery ? ["/api/doctors/search", { q: searchQuery }] : ["/api/doctors"],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/doctors/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/doctors";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json();
    },
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = (rating % 10) >= 5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex" aria-label={`${rating / 10} out of 5 stars`}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <section className="lg:col-span-1" aria-labelledby="doctor-selection-heading">
      <Card className={`${!isActive ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              1
            </div>
            <h3 id="doctor-selection-heading" className="text-xl font-semibold text-gray-900">
              Select Your Specialist
            </h3>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <Label htmlFor="specialist-search" className="block text-lg font-medium text-gray-700 mb-2">
              Search Specialists
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="specialist-search"
                name="specialist-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 px-4 pr-10 text-lg focus-ring"
                placeholder="Search by name or specialty..."
                aria-describedby="search-help"
              />
              <Search className="absolute right-3 top-4 h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <p id="search-help" className="text-sm text-gray-600 mt-1">
              Search by doctor name, location, or allergy specialty
            </p>
          </div>

          {/* Specialist Cards */}
          <div className="space-y-4" role="list" aria-label="Available specialists">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : doctors && doctors.length > 0 ? (
              doctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-colors hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50 ${
                      isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'
                    }`}
                    role="listitem"
                  >
                    <CardContent className="p-4">
                      <input
                        type="radio"
                        id={`doctor-${doctor.id}`}
                        name="selected-doctor"
                        value={doctor.id}
                        checked={isSelected}
                        onChange={() => onDoctorSelect(doctor)}
                        className="sr-only focus-ring"
                      />
                      <label htmlFor={`doctor-${doctor.id}`} className="cursor-pointer block">
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: doctor.avatarColor }}
                          >
                            {doctor.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h4>
                            <p className="text-gray-600 truncate">{doctor.specialty}</p>
                            <div className="flex items-center mt-2">
                              {renderStars(doctor.rating)}
                              <span className="text-sm text-gray-600 ml-2">
                                {(doctor.rating / 10).toFixed(1)} ({doctor.reviewCount} reviews)
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="truncate">{doctor.clinic} • {doctor.distance}</span>
                            </div>
                            {isSelected && (
                              <div className="mt-2 flex items-center">
                                <CheckCircle className="h-4 w-4 text-secondary mr-1" aria-hidden="true" />
                                <span className="text-sm text-secondary font-medium">Selected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">No specialists found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
