import { useEffect, useState } from "react";
import axios from "@/api/axiosClient";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

type Notification = {
  _id: string;
  user: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const doctorId = localStorage.getItem("userId") || localStorage.getItem("_id");

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/notifications/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
        // Dispatch event to update bell icon count
        window.dispatchEvent(new Event("notificationChanged"));
      } catch (err) {
        alert("Failed to fetch notifications");
      }
      setLoading(false);
    }
    fetchNotifications();
  }, [doctorId]);

  async function clearNotifications() {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/notifications/doctor/${doctorId}/clear`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      // Dispatch event to update bell icon count
      window.dispatchEvent(new Event("notificationCleared"));
    } catch (err) {
      alert("Failed to clear notifications");
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Notifications</h2>
          <div className="flex justify-end mb-4">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              onClick={clearNotifications}
            >
              Clear Notifications
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No notifications.</div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`p-4 rounded shadow ${n.isRead ? "bg-gray-100" : "bg-white border-l-4 border-indigo-500"}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{n.message}</span>
                    {n.link && (
                      <a href={n.link} className="text-indigo-600 underline ml-2" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}