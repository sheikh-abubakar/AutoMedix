import { useEffect, useState } from "react";
// @ts-ignore
import axios from "@/api/axiosClient";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function VideoConsultation() {
  const [appointments, setAppointments] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const patientId = localStorage.getItem("userId");
        const res = await axios.get(`/appointments/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.filter((a: any) =>
        (a.type === "video" || a.type === "video-call") && a.videoRoomUrl
      ));
      } catch (err) {
        alert("Failed to fetch appointments");
      }
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">My Video Consultations</h2>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Video Appointments</h3>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No video appointments scheduled.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Symptoms</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a: any) => (
                    <tr key={a._id} className="border-t">
                      <td className="py-2">{a.doctor?.name}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.symptoms || "-"}</td>
                      <td>
                        <button
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                          onClick={() => setSelectedRoom(a.videoRoomUrl)}
                        >
                          Join Consultation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {selectedRoom && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Live Video Consultation</h3>
              <iframe
                src={selectedRoom}
                title="Daily Video Consultation"
                allow="camera; microphone; fullscreen; speaker"
                style={{
                  width: "100%",
                  height: "600px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <div className="text-center mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  onClick={() => setSelectedRoom("")}
                >
                  Leave Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}