import React, { useState, useEffect } from "react";
import axios from "axios";

interface BookAppointmentModalProps {
  doctor: any;
  patientId: string;
  onClose: () => void;
  onBooked: () => void;
}

const appointmentTypes = [
  { value: "general-checkup", label: "General Checkup" },
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "video-call", label: "Video Consultation" },
];

export default function BookAppointmentModal({
  doctor,
  patientId,
  onClose,
  onBooked,
}: BookAppointmentModalProps) {
  const [schedule, setSchedule] = useState<any>(undefined);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (doctor && doctor._id) {
      axios
        .get(`http://localhost:5000/api/schedule/${doctor._id}`)
        .then((res) => setSchedule(res.data))
        .catch(() => setSchedule(null));
    }
  }, [doctor]);

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

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!schedule) {
      setMessage("Doctor has not set their schedule yet.");
      return;
    }
    const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });
    if (!schedule.days.includes(dayOfWeek)) {
      setMessage("Doctor not available on selected day.");
      return;
    }
    if (time < schedule.startTime || time > schedule.endTime) {
      setMessage("Doctor not available at selected time.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/appointments/book", {
        doctorId: doctor._id,
        patientId,
        date,
        time,
        type,
        symptoms,
        notes,
      });
      setMessage("Appointment booked!");
      onBooked();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  if (!doctor) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">Book Appointment with {doctor.name}</h2>
        {schedule === undefined ? (
          <div>Loading schedule...</div>
        ) : schedule === null ? (
          <div className="text-red-600">Doctor has not set their schedule yet.</div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            <div className="mb-2">Available Days: {schedule.days.join(", ")}</div>
            <div className="mb-2">Time: {schedule.startTime} - {schedule.endTime}</div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            >
              <option value="">Select time...</option>
              {getTimeSlots().map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            >
              <option value="">Select appointment type...</option>
              {appointmentTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms..."
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional information for the doctor..."
              className="border rounded-lg px-3 py-2 mb-2 w-full"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg w-full">
              Book Appointment
            </button>
            {message && <div className="mt-2 text-red-600">{message}</div>}
          </form>
        )}
      </div>
    </div>
  );
}