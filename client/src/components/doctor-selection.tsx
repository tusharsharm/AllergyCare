import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, MapPin, CheckCircle, Award, Languages, IndianRupee, Phone, Clock } from "lucide-react";
import type { Doctor } from "@shared/schema";
import { LocationSelector, type LocationData } from "./location-selector";

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
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  // Fetch doctors based on location or search query
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: userLocation 
      ? ["/api/doctors/location", userLocation.latitude, userLocation.longitude]
      : searchQuery 
        ? ["/api/doctors/search", { q: searchQuery }] 
        : ["/api/doctors"],
    queryFn: async () => {
      let url = "/api/doctors";
      
      if (userLocation) {
        url = `/api/doctors/location/${userLocation.latitude}/${userLocation.longitude}`;
      } else if (searchQuery) {
        url = `/api/doctors/search?q=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json();
    },
    enabled: isActive,
  });

  const handleLocationSelect = (location: LocationData) => {
    setUserLocation(location);
  };

  const renderStars = (rating: number) => {
    const normalizedRating = rating / 10; // Convert from 0-50 scale to 0-5 scale
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = (normalizedRating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1" aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}>
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {normalizedRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const generateInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const generateAvatarColor = (name: string) => {
    const colors = [
      "#1565C0", "#2E7D32", "#E65100", "#5E35B1", 
      "#C62828", "#00695C", "#EF6C00", "#1565C0"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className="lg:col-span-1" aria-labelledby="doctor-selection-heading">
      <Card className={`${!isActive ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              1
            </div>
            <h3 id="doctor-selection-heading" className="text-xl font-semibold">
              Select Your Allergy Specialist
            </h3>
          </div>

          {/* Location Selector */}
          <LocationSelector 
            onLocationSelected={handleLocationSelect}
            currentLocation={userLocation}
          />

          {/* Search and Filter */}
          <div className="mb-6">
            <Label htmlFor="specialist-search" className="block text-lg font-medium mb-2">
              Search Specialists
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="specialist-search"
                name="specialist-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 px-4 pr-10 text-lg"
                placeholder="Search by name, city, specialty, or language..."
                aria-describedby="search-help"
                disabled={!isActive}
              />
              <Search className="absolute right-3 top-4 h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <p id="search-help" className="text-sm text-muted-foreground mt-1">
              Find specialists by name, location, specialty, qualifications, or languages spoken
            </p>
          </div>

          {/* Specialist Cards */}
          <div className="space-y-4" role="list" aria-label="Available allergy specialists">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : doctors && doctors.length > 0 ? (
              doctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                const initials = generateInitials(doctor.firstName, doctor.lastName);
                const avatarColor = generateAvatarColor(doctor.firstName);

                return (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary/5' : 'hover:border-primary/50'
                    } ${!isActive ? 'pointer-events-none' : ''}`}
                    role="listitem"
                    onClick={() => isActive && onDoctorSelect(doctor)}
                  >
                    <CardContent className="p-4">
                      <input
                        type="radio"
                        id={`doctor-${doctor.id}`}
                        name="selected-doctor"
                        value={doctor.id}
                        checked={isSelected}
                        onChange={() => isActive && onDoctorSelect(doctor)}
                        className="sr-only"
                        disabled={!isActive}
                        aria-labelledby={`doctor-${doctor.id}-label`}
                      />
                      
                      <div className="flex items-start gap-4">
                        {/* Doctor Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback 
                              style={{ backgroundColor: avatarColor }}
                              className="text-white font-bold text-lg"
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 id={`doctor-${doctor.id}-label`} className="text-lg font-semibold text-foreground">
                                Dr. {doctor.firstName} {doctor.lastName}
                                {doctor.isVerified && (
                                  <Award className="inline ml-2 h-4 w-4 text-blue-500" aria-label="Verified specialist" />
                                )}
                              </h4>
                              <p className="text-primary font-medium">{doctor.specialty}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" aria-hidden="true" />
                            )}
                          </div>

                          {/* Rating and Experience */}
                          <div className="flex items-center gap-4 mt-2">
                            {renderStars(doctor.rating)}
                            <span className="text-sm text-muted-foreground">
                              ({doctor.reviewCount} reviews)
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {doctor.experience}+ years exp.
                            </Badge>
                          </div>

                          {/* Clinic and Location */}
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {doctor.clinic}, {doctor.city}, {doctor.state}
                            </span>
                          </div>

                          {/* Consultation Fee */}
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-400">
                              ₹{doctor.consultationFee} consultation
                            </span>
                          </div>

                          {/* Languages */}
                          {doctor.languages && doctor.languages.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <Languages className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground truncate">
                                {doctor.languages.join(", ")}
                              </span>
                            </div>
                          )}

                          {/* Phone Number */}
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{doctor.phone}</span>
                          </div>

                          {/* Qualifications */}
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {doctor.qualifications}
                            </p>
                          </div>

                          {/* Calculate distance if location is available */}
                          {userLocation && 'calculatedDistance' in doctor && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">
                                {(doctor as any).calculatedDistance < 1 
                                  ? `${((doctor as any).calculatedDistance * 1000).toFixed(0)}m away`
                                  : `${(doctor as any).calculatedDistance.toFixed(1)}km away`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    {searchQuery || userLocation ? (
                      <>
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-medium mb-2">No specialists found</h4>
                        <p className="text-sm">
                          {searchQuery 
                            ? `No specialists match "${searchQuery}". Try different keywords.`
                            : "No specialists found in this area. Try expanding your search or enter a different location."
                          }
                        </p>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-medium mb-2">Find Specialists Near You</h4>
                        <p className="text-sm">
                          Select your location above to discover qualified allergy specialists in your area.
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {selectedDoctor && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} selected
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Proceed to select your appointment date and time
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}