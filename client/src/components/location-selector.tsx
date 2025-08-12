import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, Search, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface LocationData {
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  pincode?: string;
}

interface LocationSelectorProps {
  onLocationSelected: (location: LocationData) => void;
  currentLocation?: LocationData | null;
}

export function LocationSelector({ onLocationSelected, currentLocation }: LocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection. Please enter your pincode manually.",
        variant: "destructive"
      });
      return;
    }

    setIsDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // For demo purposes, we'll reverse geocode to a known Indian city
          // In production, you'd use a proper reverse geocoding service
          let city = "Mumbai";
          let state = "Maharashtra";
          let detectedPincode = "400001";
          
          // Simple reverse geocoding based on coordinates
          if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 77.0 && longitude <= 77.5) {
            city = "Delhi";
            state = "Delhi";
            detectedPincode = "110001";
          } else if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
            city = "Bangalore";
            state = "Karnataka";
            detectedPincode = "560001";
          } else if (latitude >= 12.9 && latitude <= 13.3 && longitude >= 80.1 && longitude <= 80.5) {
            city = "Chennai";
            state = "Tamil Nadu";
            detectedPincode = "600001";
          } else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.7) {
            city = "Hyderabad";
            state = "Telangana";
            detectedPincode = "500001";
          }

          const locationData: LocationData = {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            city,
            state,
            pincode: detectedPincode
          };

          // Save the location
          await apiRequest("/api/location", "POST", locationData);
          
          onLocationSelected(locationData);
          toast({
            title: "Location detected",
            description: `Found specialists near ${city}, ${state}`
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to detect your location. Please enter your pincode.",
            variant: "destructive"
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        toast({
          title: "Location access denied",
          description: "Please enter your pincode to find specialists near you.",
          variant: "destructive"
        });
      },
      { timeout: 10000 }
    );
  };

  const searchByPincode = async () => {
    if (!pincode.trim() || pincode.length !== 6) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/location/pincode/${pincode}`);
      
      if (!response.ok) {
        throw new Error("Pincode not found");
      }
      
      const locationData = await response.json();
      const fullLocationData: LocationData = {
        ...locationData,
        pincode
      };

      // Save the location
      await apiRequest("/api/location", "POST", fullLocationData);
      
      onLocationSelected(fullLocationData);
      toast({
        title: "Location found",
        description: `Found specialists in ${locationData.city}, ${locationData.state}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to find location for this pincode. Please check and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (currentLocation) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">
              Showing specialists near {currentLocation.city}, {currentLocation.state}
              {currentLocation.pincode && ` (${currentLocation.pincode})`}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Find Specialists Near You
        </CardTitle>
        <CardDescription>
          Help us find allergy specialists in your area for the best care
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            className="w-full"
            variant="default"
          >
            {isDetecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Detecting Location...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Use My Current Location
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Enter Pincode</Label>
            <div className="flex gap-2">
              <Input
                id="pincode"
                type="text"
                placeholder="e.g. 400001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchByPincode();
                  }
                }}
                aria-describedby="pincode-help"
              />
              <Button 
                onClick={searchByPincode}
                disabled={isSearching || !pincode.trim()}
                size="icon"
                variant="outline"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p id="pincode-help" className="text-xs text-muted-foreground">
              Enter your area's 6-digit postal code to find nearby specialists
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}