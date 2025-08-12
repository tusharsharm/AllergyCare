import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Doctor, InsertAppointment } from "@shared/schema";

interface PatientFormProps {
  selectedDoctor: Doctor;
  selectedDate: string;
  selectedTime: string;
  onSubmit: (data: Partial<InsertAppointment>) => void;
  isActive: boolean;
}

const patientFormSchema = z.object({
  patientFirstName: z.string().min(1, "First name is required"),
  patientLastName: z.string().min(1, "Last name is required"),
  patientEmail: z.string().email("Please enter a valid email address"),
  patientPhone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  insurance: z.string().optional(),
  allergies: z.string().min(1, "Please list your known allergies"),
  symptoms: z.string().optional(),
  visitReasons: z.array(z.string()).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export default function PatientForm({
  selectedDoctor,
  selectedDate,
  selectedTime,
  onSubmit,
  isActive
}: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      patientFirstName: "",
      patientLastName: "",
      patientEmail: "",
      patientPhone: "",
      dateOfBirth: "",
      insurance: "",
      allergies: "",
      symptoms: "",
      visitReasons: [],
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
  });

  const handleSubmit = (data: PatientFormData) => {
    const appointmentData: Partial<InsertAppointment> = {
      ...data,
      doctorId: selectedDoctor.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    };
    onSubmit(appointmentData);
  };

  const handleVisitReasonChange = (reason: string, checked: boolean) => {
    const currentReasons = form.getValues("visitReasons") || [];
    if (checked) {
      form.setValue("visitReasons", [...currentReasons, reason]);
    } else {
      form.setValue("visitReasons", currentReasons.filter(r => r !== reason));
    }
  };

  return (
    <section className="mt-8" aria-labelledby="patient-info-heading">
      <Card className={`${!isActive ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              3
            </div>
            <h3 id="patient-info-heading" className="text-xl font-semibold text-gray-900">
              Patient Information
            </h3>
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" aria-label="Patient information form">
            {/* Personal Information */}
            <fieldset className="border-2 border-gray-200 rounded-lg p-6">
              <legend className="text-lg font-medium text-gray-900 px-2">Personal Information</legend>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label htmlFor="first-name" className="block text-lg font-medium text-gray-700 mb-2">
                    First Name <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="first-name"
                    {...form.register("patientFirstName")}
                    className="h-12 text-lg focus-ring"
                    aria-describedby="first-name-error"
                    disabled={!isActive}
                  />
                  {form.formState.errors.patientFirstName && (
                    <div id="first-name-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.patientFirstName.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="last-name" className="block text-lg font-medium text-gray-700 mb-2">
                    Last Name <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="last-name"
                    {...form.register("patientLastName")}
                    className="h-12 text-lg focus-ring"
                    aria-describedby="last-name-error"
                    disabled={!isActive}
                  />
                  {form.formState.errors.patientLastName && (
                    <div id="last-name-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.patientLastName.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                    Email Address <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("patientEmail")}
                    className="h-12 text-lg focus-ring"
                    aria-describedby="email-help email-error"
                    disabled={!isActive}
                  />
                  <p id="email-help" className="text-sm text-gray-600 mt-1">
                    We'll send appointment confirmations to this email
                  </p>
                  {form.formState.errors.patientEmail && (
                    <div id="email-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.patientEmail.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("patientPhone")}
                    placeholder="(555) 123-4567"
                    className="h-12 text-lg focus-ring"
                    aria-describedby="phone-help phone-error"
                    disabled={!isActive}
                  />
                  <p id="phone-help" className="text-sm text-gray-600 mt-1">
                    For appointment reminders and emergency contact
                  </p>
                  {form.formState.errors.patientPhone && (
                    <div id="phone-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.patientPhone.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="date-of-birth" className="block text-lg font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="date-of-birth"
                    type="date"
                    {...form.register("dateOfBirth")}
                    className="h-12 text-lg focus-ring"
                    aria-describedby="dob-error"
                    disabled={!isActive}
                  />
                  {form.formState.errors.dateOfBirth && (
                    <div id="dob-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.dateOfBirth.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="insurance" className="block text-lg font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </Label>
                  <Select onValueChange={(value) => form.setValue("insurance", value)} disabled={!isActive}>
                    <SelectTrigger className="h-12 text-lg focus-ring" aria-describedby="insurance-help">
                      <SelectValue placeholder="Select your insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="humana">Humana</SelectItem>
                      <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
                      <SelectItem value="medicare">Medicare</SelectItem>
                      <SelectItem value="medicaid">Medicaid</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="self-pay">Self-pay</SelectItem>
                    </SelectContent>
                  </Select>
                  <p id="insurance-help" className="text-sm text-gray-600 mt-1">
                    Select your insurance provider to check coverage
                  </p>
                </div>
              </div>
            </fieldset>

            {/* Allergy Information */}
            <fieldset className="border-2 border-gray-200 rounded-lg p-6">
              <legend className="text-lg font-medium text-gray-900 px-2">Allergy Information</legend>
              
              <div className="space-y-6 mt-4">
                <div>
                  <Label htmlFor="allergies" className="block text-lg font-medium text-gray-700 mb-2">
                    Known Allergies <span className="text-error" aria-label="required">*</span>
                  </Label>
                  <Textarea
                    id="allergies"
                    {...form.register("allergies")}
                    rows={4}
                    placeholder="Please list all known allergies, including foods, medications, environmental allergens, etc."
                    className="text-lg focus-ring"
                    aria-describedby="allergies-help allergies-error"
                    disabled={!isActive}
                  />
                  <p id="allergies-help" className="text-sm text-gray-600 mt-1">
                    Include foods, medications, environmental allergens, and severity of reactions
                  </p>
                  {form.formState.errors.allergies && (
                    <div id="allergies-error" className="text-error text-sm mt-1" role="alert">
                      {form.formState.errors.allergies.message}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="symptoms" className="block text-lg font-medium text-gray-700 mb-2">
                    Current Symptoms
                  </Label>
                  <Textarea
                    id="symptoms"
                    {...form.register("symptoms")}
                    rows={3}
                    placeholder="Describe any current allergy symptoms you're experiencing..."
                    className="text-lg focus-ring"
                    aria-describedby="symptoms-help"
                    disabled={!isActive}
                  />
                  <p id="symptoms-help" className="text-sm text-gray-600 mt-1">
                    Optional: Describe any current symptoms you'd like to discuss
                  </p>
                </div>

                <div>
                  <fieldset>
                    <legend className="text-lg font-medium text-gray-700 mb-3">Reason for Visit</legend>
                    <div className="space-y-3">
                      {[
                        { value: "new-allergy", label: "New allergy symptoms or suspected allergies" },
                        { value: "follow-up", label: "Follow-up appointment" },
                        { value: "allergy-testing", label: "Allergy testing" },
                        { value: "treatment-review", label: "Treatment or medication review" },
                        { value: "immunotherapy", label: "Immunotherapy consultation" }
                      ].map((reason) => (
                        <div key={reason.value} className="flex items-start space-x-3">
                          <Checkbox
                            id={reason.value}
                            onCheckedChange={(checked) => handleVisitReasonChange(reason.value, checked as boolean)}
                            className="mt-1 focus-ring"
                            disabled={!isActive}
                          />
                          <Label htmlFor={reason.value} className="text-lg cursor-pointer">
                            {reason.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </fieldset>

            {/* Emergency Contact */}
            <fieldset className="border-2 border-gray-200 rounded-lg p-6">
              <legend className="text-lg font-medium text-gray-900 px-2">Emergency Contact</legend>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label htmlFor="emergency-name" className="block text-lg font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergency-name"
                    {...form.register("emergencyContactName")}
                    className="h-12 text-lg focus-ring"
                    disabled={!isActive}
                  />
                </div>

                <div>
                  <Label htmlFor="emergency-phone" className="block text-lg font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergency-phone"
                    type="tel"
                    {...form.register("emergencyContactPhone")}
                    placeholder="(555) 123-4567"
                    className="h-12 text-lg focus-ring"
                    disabled={!isActive}
                  />
                </div>

                <div>
                  <Label htmlFor="emergency-relationship" className="block text-lg font-medium text-gray-700 mb-2">
                    Relationship
                  </Label>
                  <Select onValueChange={(value) => form.setValue("emergencyContactRelationship", value)} disabled={!isActive}>
                    <SelectTrigger className="h-12 text-lg focus-ring">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isActive}
                className="h-12 px-8 text-lg bg-primary hover:bg-primary-dark focus-ring"
              >
                Continue to Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
