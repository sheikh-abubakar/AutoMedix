import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SetSchedule({ doctorId, onSaved }: { doctorId: string; onSaved: () => void }) {
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/schedule/${doctorId}`)
        .then(res => {
          if (res.data) {
            setDays(res.data.days || []);
            setStartTime(res.data.startTime || "09:00");
            setEndTime(res.data.endTime || "17:00");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/schedule/set", { doctorId, days, startTime, endTime });
      toast({
        title: "Success",
        description: "Your schedule has been saved!",
      });
      onSaved();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save schedule.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading your schedule...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow-md mb-4">
      <h3 className="font-bold mb-2">Set Your Schedule</h3>
      <div className="mb-2">
        <label className="block mb-1">Available Days:</label>
        <div className="flex gap-2 flex-wrap">
          {daysOfWeek.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={e => {
                  if (e.target.checked) setDays([...days, day]);
                  else setDays(days.filter(d => d !== day));
                }}
              />{" "}
              {day}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <label>Start Time:</label>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="ml-2" />
      </div>
      <div className="mb-2">
        <label>End Time:</label>
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="ml-2" />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Schedule</button>
    </form>
  );
}