import Layout from "@/components/Layout";
import SetSchedule from "@/components/SetSchedule";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MySchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any>(null);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/schedule/${user._id}`).then(res => setSchedule(res.data));
    }
  }, [user]);

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Schedule</h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Set Your Schedule</h3>
          <SetSchedule
            doctorId={user && user._id ? user._id : ""}
            onSaved={() => {
              if (user && user._id) {
                axios.get(`http://localhost:5000/api/schedule/${user._id}`).then(res => setSchedule(res.data));
              }
            }}
          />
        </div>
        {schedule && schedule.days && (
          <div className="bg-gray-50 rounded-xl shadow border border-gray-100 p-6">
            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M8 7V3M16 7V3M4 11H20M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Your Current Schedule
            </h4>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium text-gray-600">Days:</span>
              <span className="text-gray-900">{schedule.days.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Time:</span>
              <span className="text-gray-900">{schedule.startTime} - {schedule.endTime}</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}