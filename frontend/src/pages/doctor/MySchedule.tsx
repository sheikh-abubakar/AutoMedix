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
        <h2 className="text-2xl font-bold mb-4">My Schedule</h2>
        <SetSchedule
          doctorId={user && user._id ? user._id : ""}
          onSaved={() => {
            if (user && user._id) {
              axios.get(`http://localhost:5000/api/schedule/${user._id}`).then(res => setSchedule(res.data));
            }
          }}
        />
        {schedule && schedule.days && (
          <div className="mb-4">
            <h4 className="font-bold">Your Current Schedule:</h4>
            <div>Days: {schedule.days.join(", ")}</div>
            <div>Time: {schedule.startTime} - {schedule.endTime}</div>
          </div>
        )}
      </div>
    </Layout>
  );
}