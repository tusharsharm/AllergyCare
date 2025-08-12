import { useState } from "react";
import WelcomeHero from "@/components/welcome-hero";
import DoctorSelection from "@/components/doctor-selection";
import CalendarTimeSelection from "@/components/calendar-time-selection";
import PatientForm from "@/components/patient-form";
import ReviewConfirmation from "@/components/review-confirmation";
import type { Doctor, InsertAppointment } from "@shared/schema";

export default function Home() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientData, setPatientData] = useState<Partial<InsertAppointment>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2); // Move to calendar selection step
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    if (date && time) {
      setCurrentStep(3); // Move to patient form step when both date and time are selected
    }
  };

  const handlePatientDataSubmit = (data: Partial<InsertAppointment>) => {
    setPatientData(data);
    setCurrentStep(4);
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientData({});
    setCurrentStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WelcomeHero />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <DoctorSelection
          selectedDoctor={selectedDoctor}
          onDoctorSelect={handleDoctorSelect}
          isActive={currentStep >= 1}
        />

        <div className="lg:col-span-2">
          <CalendarTimeSelection
            selectedDoctor={selectedDoctor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateTimeSelect={handleDateTimeSelect}
            isActive={currentStep >= 2 && selectedDoctor !== null}
          />
        </div>
      </div>

      {selectedDoctor && selectedDate && selectedTime && (
        <PatientForm
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSubmit={handlePatientDataSubmit}
          isActive={currentStep >= 3}
        />
      )}

      {currentStep === 4 && selectedDoctor && selectedDate && selectedTime && (
        <ReviewConfirmation
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          patientData={patientData}
          onReset={resetBooking}
        />
      )}
    </div>
  );
}
