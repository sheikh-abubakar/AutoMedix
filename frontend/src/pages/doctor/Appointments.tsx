import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/appointments/doctor/${user._id}`).then(res => setAppointments(res.data));
    }
  }, [user]);

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
        <div className="mb-4">
          <h4 className="font-bold">Your Appointments:</h4>
          {appointments.length === 0 ? (
            <div>No appointments today</div>
          ) : (
            <ul>
              {appointments.map((app: any) => (
                <li key={app._id}>
                  {app.date} {app.time} - Patient: {app.patient?.name} ({app.patient?.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}