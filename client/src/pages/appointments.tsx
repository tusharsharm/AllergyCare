import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import type { Appointment, Doctor } from "@shared/schema";

export default function Appointments() {
  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const getDoctorById = (doctorId: string) => {
    return doctors?.find(doctor => doctor.id === doctorId);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
      
      {!appointments || appointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-600">
              You don't have any appointments yet. Book your first appointment to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => {
            const doctor = getDoctorById(appointment.doctorId);
            const appointmentDate = new Date(appointment.appointmentDate + "T00:00:00");
            const isUpcoming = appointmentDate >= new Date();
            
            return (
              <Card key={appointment.id} className={isUpcoming ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">
                      {isUpcoming ? "Upcoming" : "Past"} Appointment
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "confirmed" 
                        ? "bg-success/10 text-success" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {appointment.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {doctor?.firstName} {doctor?.lastName}
                          </p>
                          <p className="text-gray-600">{doctor?.specialty}</p>
                          <p className="text-sm text-gray-600">{doctor?.clinic}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CalendarDays className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointmentDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.appointmentTime}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">{doctor?.clinic}</p>
                          <p className="text-gray-600">{doctor?.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                        <p className="text-gray-600">
                          {appointment.patientFirstName} {appointment.patientLastName}
                        </p>
                        <p className="text-gray-600">{appointment.patientEmail}</p>
                        <p className="text-gray-600">{appointment.patientPhone}</p>
                      </div>

                      {appointment.allergies && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Known Allergies</h4>
                          <p className="text-gray-600 text-sm">{appointment.allergies}</p>
                        </div>
                      )}

                      {appointment.visitReasons && appointment.visitReasons.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Visit Reason</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            {appointment.visitReasons.map((reason, index) => (
                              <li key={index}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
