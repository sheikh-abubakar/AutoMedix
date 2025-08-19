import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  type: z.string().min(1, "Please select appointment type"),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const appointmentTypes = [
  { value: "general-checkup", label: "General Checkup" },
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "video-call", label: "Video Consultation" },
];

export default function BookAppointment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any>(null);
  const [scheduleError, setScheduleError] = useState<string>("");

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      type: "",
      symptoms: "",
      notes: "",
    },
  });

  // Fetch doctors from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors").then(res => setDoctors(res.data));
  }, []);

  // Fetch schedule when doctor changes
  useEffect(() => {
    setSchedule(null);
    setScheduleError("");
    const docId = form.watch("doctorId");
    if (docId) {
      const doc = doctors.find(d => d._id === docId);
      if (doc) {
        axios.get(`http://localhost:5000/api/schedule/${doc._id}`)
          .then(res => {
            if (res.data) {
              setSchedule(res.data);
            } else {
              setScheduleError("Doctor has not set their schedule yet.");
            }
          })
          .catch(() => setScheduleError("Doctor has not set their schedule yet."));
      }
    }
  }, [form.watch("doctorId"), doctors]);

  // Generate available time slots from schedule
  const getTimeSlots = () => {
    if (!schedule) return [];
    const start = parseInt(schedule.startTime.split(":")[0], 10);
    const end = parseInt(schedule.endTime.split(":")[0], 10);
    const slots = [];
    for (let h = start; h < end; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      return await axios.post("http://localhost:5000/api/appointments/book", {
        doctorId: data.doctorId,
        patientId: user?._id || "",
        date: data.appointmentDate,
        time: data.appointmentTime,
        type: data.type,
        symptoms: data.symptoms,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment booked successfully! You will receive a confirmation shortly.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    if (!schedule) {
      toast({
        title: "Error",
        description: "Doctor has not set their schedule yet.",
        variant: "destructive",
      });
      return;
    }
    // Validate day of week
    const dayOfWeek = new Date(data.appointmentDate).toLocaleString("en-US", { weekday: "long" });
    if (!schedule.days.includes(dayOfWeek)) {
      toast({
        title: "Error",
        description: "Doctor not available on selected day.",
        variant: "destructive",
      });
      return;
    }
    if (data.appointmentTime < schedule.startTime || data.appointmentTime > schedule.endTime) {
      toast({
        title: "Error",
        description: "Doctor not available at selected time.",
        variant: "destructive",
      });
      return;
    }
    bookAppointmentMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-1">Schedule a consultation with your preferred doctor</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Appointment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Select Doctor</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-doctor">
                            <SelectValue placeholder="Choose a doctor..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors.map(doctor => (
                            <SelectItem key={doctor._id} value={doctor._id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {scheduleError && (
                  <div className="text-red-600 mb-2">{scheduleError}</div>
                )}

                {schedule && (
                  <>
                    <div className="mb-2">Available Days: {schedule.days.join(", ")}</div>
                    <div className="mb-2">Time: {schedule.startTime} - {schedule.endTime}</div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                            data-testid="input-appointment-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Time</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-appointment-time">
                              <SelectValue placeholder="Select time..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getTimeSlots().map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-appointment-type">
                            <SelectValue placeholder="Select appointment type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {appointmentTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your symptoms..."
                          {...field}
                          data-testid="textarea-symptoms"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Additional Notes (Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional information for the doctor..."
                          {...field}
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={bookAppointmentMutation.isPending}
                    data-testid="button-book-appointment"
                  >
                    {bookAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => form.reset()}
                    data-testid="button-reset-form"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}