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
        description: "Appointment booked successfully!",
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

        <div className="max-w-xl mx-auto mt-10">
          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Appointment Details
              </CardTitle>
              <p className="text-gray-500">Schedule a consultation with your preferred doctor</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Doctor Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                  <select
                    value={form.watch("doctorId")}
                    onChange={e => form.setValue("doctorId", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                    ))}
                  </select>
                </div>

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={form.watch("appointmentDate")}
                      onChange={e => form.setValue("appointmentDate", e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <select
                      value={form.watch("appointmentTime")}
                      onChange={e => form.setValue("appointmentTime", e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="">Select time...</option>
                      {getTimeSlots().map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={form.watch("type")}
                    onChange={e => form.setValue("type", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select appointment type...</option>
                    {appointmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Additional Notes (Optional)</label>
                  <textarea
                    value={form.watch("notes")}
                    onChange={e => form.setValue("notes", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    placeholder="Describe your symptoms or add any notes for the doctor..."
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}