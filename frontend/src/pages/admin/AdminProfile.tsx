import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProfile() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState({
    email: "",
    profileImageUrl: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchAdmin() {
      if (!user?._id || !token) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/profile/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin({
          email: res.data.email,
          profileImageUrl: res.data.profileImageUrl,
        });
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchAdmin();
  }, [user?._id, token]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="max-w-xl mx-auto mt-10">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <img
                src={admin.profileImageUrl || "https://ui-avatars.com/api/?name=Admin"}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover mb-2"
              />
              <CardTitle className="text-2xl">Muhammad Abubakar</CardTitle>
              <p className="text-gray-500">{admin.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-4">
                <div>
                  <span className="font-medium">Role: </span>
                  <span>Super Admin</span>
                </div>
                <div>
                  <span className="font-medium">Joined: </span>
                  <span>August 2025</span>
                </div>
                <div>
                  <span className="font-medium">Contact: </span>
                  <span>+92 300 1234567</span>
                </div>
                <div>
                  <span className="font-medium">Location: </span>
                  <span>Lahore, Pakistan</span>
                </div>
                <div>
                  <span className="font-medium">Bio: </span>
                  <span>
                    Dedicated to managing AutoMedix platform, ensuring smooth operations and supporting doctors and patients.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}