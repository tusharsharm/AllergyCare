import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Doctor, TimeSlot } from "@shared/schema";

interface CalendarTimeSelectionProps {
  selectedDoctor: Doctor | null;
  selectedDate: string;
  selectedTime: string;
  onDateTimeSelect: (date: string, time: string) => void;
  isActive: boolean;
}

export default function CalendarTimeSelection({
  selectedDoctor,
  selectedDate,
  selectedTime,
  onDateTimeSelect,
  isActive
}: CalendarTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  // Generate calendar dates for current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    setCalendarDates(dates);
  }, [currentMonth]);

  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ["/api/doctors", selectedDoctor?.id, "timeslots", selectedDate],
    enabled: !!(selectedDoctor && selectedDate),
  });

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    onDateTimeSelect(dateStr, selectedTime);
  };

  const handleTimeSelect = (time: string) => {
    onDateTimeSelect(selectedDate, time);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateAvailable = (date: Date) => {
    // Don't allow past dates or weekends
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupTimeSlotsByPeriod = (slots: TimeSlot[]) => {
    const morning = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      const isPM = slot.time.includes('PM');
      return !isPM && hour < 12;
    });

    const afternoon = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      const isPM = slot.time.includes('PM');
      return isPM && (hour === 12 || hour < 6);
    });

    const evening = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      const isPM = slot.time.includes('PM');
      return isPM && hour >= 6;
    });

    return { morning, afternoon, evening };
  };

  return (
    <section aria-labelledby="datetime-selection-heading">
      <Card className={`${!isActive ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              2
            </div>
            <h3 id="datetime-selection-heading" className="text-xl font-semibold text-gray-900">
              Choose Date & Time
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Select Date</h4>
              <Card className="border-2 border-gray-200">
                <CardContent className="p-4">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={previousMonth}
                      className="p-2 hover:bg-gray-100 focus-ring"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h5 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 focus-ring"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDates.map((date, index) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      const isAvailable = isDateAvailable(date);
                      const isCurrent = isCurrentMonth(date);
                      
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => isAvailable && handleDateSelect(date)}
                          disabled={!isAvailable || !isActive}
                          className={`calendar-day h-10 rounded-md focus-ring ${
                            isSelected ? 'selected' : ''
                          } ${!isCurrent ? 'text-gray-400' : ''} ${
                            !isAvailable ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-blue-50'
                          }`}
                          aria-label={`${date.toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}${isSelected ? ' - Selected' : ''}${!isAvailable ? ' - Not available' : ''}`}
                        >
                          {date.getDate()}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Slots */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {selectedDate ? `Available Times - ${formatSelectedDate(selectedDate)}` : 'Select a date first'}
              </h4>
              
              {!selectedDate ? (
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">Please select a date to view available times.</p>
                  </CardContent>
                </Card>
              ) : timeSlotsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : timeSlots && timeSlots.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(() => {
                    const { morning, afternoon, evening } = groupTimeSlotsByPeriod(timeSlots);
                    
                    return (
                      <>
                        {morning.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Morning</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {morning.map(slot => (
                                <Button
                                  key={slot.id}
                                  variant="outline"
                                  onClick={() => handleTimeSelect(slot.time)}
                                  disabled={!isActive}
                                  className={`time-slot h-12 text-lg focus-ring ${
                                    selectedTime === slot.time ? 'selected' : ''
                                  }`}
                                  aria-label={`${slot.time} appointment slot${selectedTime === slot.time ? ' - Selected' : ''}`}
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {afternoon.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Afternoon</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {afternoon.map(slot => (
                                <Button
                                  key={slot.id}
                                  variant="outline"
                                  onClick={() => handleTimeSelect(slot.time)}
                                  disabled={!isActive}
                                  className={`time-slot h-12 text-lg focus-ring ${
                                    selectedTime === slot.time ? 'selected' : ''
                                  }`}
                                  aria-label={`${slot.time} appointment slot${selectedTime === slot.time ? ' - Selected' : ''}`}
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {evening.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Evening</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {evening.map(slot => (
                                <Button
                                  key={slot.id}
                                  variant="outline"
                                  onClick={() => handleTimeSelect(slot.time)}
                                  disabled={!isActive}
                                  className={`time-slot h-12 text-lg focus-ring ${
                                    selectedTime === slot.time ? 'selected' : ''
                                  }`}
                                  aria-label={`${slot.time} appointment slot${selectedTime === slot.time ? ' - Selected' : ''}`}
                                >
                                  {slot.time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">No available times for this date.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
