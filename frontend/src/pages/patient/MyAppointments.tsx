import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";

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

const stripePromise = loadStripe("pk_test_51Rto1H1emUyFYw3azoBkzgv2j3uzPwY60Al3myfvIgqEXrydNRovc8YxO5P4AYEcpdoLOOYRtEGSIcW3J6cPVUol00XyGzzNWq"); 

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

  const handlePayOnline = async (appointmentId: string) => {
    try {
      const res = await axios.post("http://localhost:5000/api/payments/create-checkout-session", {
        appointmentId,
      });
      const stripe = await stripePromise;
      if (stripe && res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert("Payment initiation failed.");
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
      setAppointments(prev => prev.filter(app => app._id !== appointmentId));
    } catch (err) {
      alert("Failed to cancel appointment.");
    }
  };

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
              <Card key={app._id} className="shadow-md hover:shadow-lg transition-shadow relative">
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
                  <div className="flex items-center space-x-4 mb-2 justify-center">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{new Date(app.date).toLocaleDateString()}</span>
                    <Clock className="h-5 w-5 text-blue-500 ml-4" />
                    <span className="font-medium">{app.time}</span>
                  </div>

                  {/* Centered Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center"
                      onClick={() => handlePayOnline(app._id)}
                    >
                      Pay Online
                    </button>
                    <button
                      className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition flex items-center"
                      onClick={() => handleCancel(app._id)}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel 
                    </button>
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