import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  UserRound, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Edit, 
  X, 
  Info, 
  Check,
  Phone,
  Mail
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Doctor, InsertAppointment } from "@shared/schema";

interface ReviewConfirmationProps {
  selectedDoctor: Doctor;
  selectedDate: string;
  selectedTime: string;
  patientData: Partial<InsertAppointment>;
  onReset: () => void;
}

export default function ReviewConfirmation({
  selectedDoctor,
  selectedDate,
  selectedTime,
  patientData,
  onReset
}: ReviewConfirmationProps) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [cancellationAccepted, setCancellationAccepted] = useState(false);
  const [textReminders, setTextReminders] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment Confirmed!",
        description: "Your appointment has been successfully booked. You'll receive a confirmation email shortly.",
      });
      onReset();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmAppointment = () => {
    if (!consentGiven || !cancellationAccepted) {
      toast({
        title: "Required Consents",
        description: "Please accept the required consent and cancellation policy before confirming.",
        variant: "destructive",
      });
      return;
    }

    const appointmentData: InsertAppointment = {
      doctorId: selectedDoctor.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      ...patientData as Omit<InsertAppointment, 'doctorId' | 'appointmentDate' | 'appointmentTime'>
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <section className="mt-8" aria-labelledby="review-heading">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              4
            </div>
            <h3 id="review-heading" className="text-xl font-semibold text-gray-900">
              Review & Confirm Appointment
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Appointment Summary */}
            <div className="space-y-6">
              <Card className="bg-blue-50 border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-xl">Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserRound className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                      </p>
                      <p className="text-gray-600">{selectedDoctor.specialty}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor.clinic}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                      <p className="text-gray-600">30 minute appointment</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedDoctor.clinic}</p>
                      <p className="text-gray-600">{selectedDoctor.location}</p>
                      <p className="text-gray-600">{selectedDoctor.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-gray-900">Estimated Cost</p>
                      <p className="text-gray-600">$150 - $200 (before insurance)</p>
                      <p className="text-sm text-success flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Your insurance may cover this visit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card className="bg-yellow-50 border-2 border-accent">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 text-accent mr-2" aria-hidden="true" />
                    Important Information
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-secondary mr-2 mt-1" aria-hidden="true" />
                      <span>Please arrive 15 minutes early for check-in</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-secondary mr-2 mt-1" aria-hidden="true" />
                      <span>Bring your insurance card and ID</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-secondary mr-2 mt-1" aria-hidden="true" />
                      <span>List all current medications</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-secondary mr-2 mt-1" aria-hidden="true" />
                      <span>24-hour cancellation policy applies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Confirmation Actions */}
            <div className="space-y-6">
              {/* Consent and Terms */}
              <Card className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Consent & Terms</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={consentGiven}
                        onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                        className="mt-1 focus-ring"
                      />
                      <Label htmlFor="consent" className="text-gray-700 cursor-pointer">
                        I consent to treatment and authorize the release of medical information for billing purposes. 
                        <a href="#" className="text-primary underline hover:no-underline focus-ring ml-1">
                          Read full consent form
                        </a>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="cancellation"
                        checked={cancellationAccepted}
                        onCheckedChange={(checked) => setCancellationAccepted(checked as boolean)}
                        className="mt-1 focus-ring"
                      />
                      <Label htmlFor="cancellation" className="text-gray-700 cursor-pointer">
                        I acknowledge the cancellation policy and agree to provide 24 hours notice for cancellations.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="reminders"
                        checked={textReminders}
                        onCheckedChange={(checked) => setTextReminders(checked as boolean)}
                        className="mt-1 focus-ring"
                      />
                      <Label htmlFor="reminders" className="text-gray-700 cursor-pointer">
                        I would like to receive appointment reminders via text message (optional).
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleConfirmAppointment}
                  disabled={createAppointmentMutation.isPending}
                  className="w-full h-14 bg-secondary hover:bg-secondary-dark text-white text-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-50"
                  aria-describedby="confirm-button-help"
                >
                  <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                  {createAppointmentMutation.isPending ? "Confirming..." : "Confirm Appointment"}
                </Button>
                <p id="confirm-button-help" className="text-sm text-gray-600 text-center">
                  You'll receive a confirmation email within minutes
                </p>

                <Button
                  variant="outline"
                  onClick={onReset}
                  disabled={createAppointmentMutation.isPending}
                  className="w-full h-12 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                  Make Changes
                </Button>

                <Button
                  variant="outline"
                  onClick={onReset}
                  disabled={createAppointmentMutation.isPending}
                  className="w-full h-12 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Cancel Booking
                </Button>
              </div>

              {/* Support Information */}
              <Card className="bg-gray-50 border-2 border-gray-200">
                <CardContent className="p-4 text-center">
                  <h5 className="font-medium text-gray-900 mb-2">Need Help?</h5>
                  <p className="text-gray-600 mb-3">Our support team is here to assist you</p>
                  <div className="space-y-2">
                    <a 
                      href="tel:1-800-255-3749" 
                      className="block text-primary hover:underline focus-ring rounded-md flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                      1-800-ALLERGY (1-800-255-3749)
                    </a>
                    <a 
                      href="mailto:support@allergybooking.com" 
                      className="block text-primary hover:underline focus-ring rounded-md flex items-center justify-center"
                    >
                      <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                      support@allergybooking.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
