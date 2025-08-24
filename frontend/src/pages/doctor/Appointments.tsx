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
      <div className="py-12 px-4 max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-sky-700 tracking-wide drop-shadow-lg">My Appointments</h2>
        <div className="mb-8 flex flex-col gap-6">
          {appointments.length === 0 ? (
            <div className="text-lg text-gray-500 text-center py-8 bg-white rounded-xl shadow">No appointments today</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {appointments.map((app: any) => (
                <div key={app._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-sky-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-sky-100 text-sky-700 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="font-semibold text-lg text-sky-700">{app.date} {app.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-green-100 text-green-700 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="font-medium text-gray-800">Patient: {app.patient?.name}</span>
                  </div>
                  <div className="text-gray-500 text-sm">{app.patient?.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}