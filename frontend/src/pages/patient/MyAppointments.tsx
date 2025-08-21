import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type DoctorType = {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  specialization?: string;
};

type AppointmentType = {
  _id: string;
  doctor: DoctorType; 
  date: string;
  time: string;
};

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/appointments/patient/${user._id}`)
        .then(res => setAppointments(res.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <Layout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">My Appointments</h2>
        <p className="mb-6 text-gray-600">View all your booked appointments with doctors.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">You have not booked any appointments yet.</p>
            </div>
          ) : (
            appointments.map(app => (
              <Card key={app._id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center space-x-3 border-b">
                  <Avatar>
                    <AvatarImage src={app.doctor?.profileImageUrl || ""} />
                    <AvatarFallback>
                      {app.doctor?.name
                        ? app.doctor.name.split(" ").map(n => n[0]).join("")
                        : "DR"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{app.doctor?.name || "Unknown Doctor"}</CardTitle>
                    <p className="text-sm text-gray-500">{app.doctor?.specialization || ""}</p>
                    <p className="text-xs text-gray-400">{app.doctor?.email || ""}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{new Date(app.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{app.time}</span>
                  </div>
                  
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}