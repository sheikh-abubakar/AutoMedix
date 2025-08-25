import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export default function PatientProfile() {
  const { user } = useAuth();
  const [editField, setEditField] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    profileImageUrl: user?.profileImageUrl || "",
  });
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch latest patient info from backend
  useEffect(() => {
    async function fetchPatient() {
      if (!user?._id || !token) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/patient/profile/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          age: res.data.age?.toString() || "",
          gender: res.data.gender || "",
          profileImageUrl: res.data.profileImageUrl || "",
        });
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchPatient();
  }, [user?._id, token]);

  // Save handler: update patient info in DB
  const handleSave = async () => {
    setEditField(null);
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/patient/profile/${user?._id}`,
        {
          age: form.age,
          gender: form.gender,
          profileImageUrl: form.profileImageUrl,
        },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
      setForm({
        ...form,
        age: res.data.age?.toString() || "",
        gender: res.data.gender || "",
        profileImageUrl: res.data.profileImageUrl || form.profileImageUrl,
      });
    } catch (err) {
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-lg mx-auto mt-12">
          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardHeader className="flex flex-col items-center pb-0">
              <div className="relative">
                <img
                  src={form.profileImageUrl || "https://ui-avatars.com/api/?name=Patient"}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover border-4 border-gray-200 shadow"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mt-4">{form.name}</CardTitle>
              <p className="text-gray-500">{form.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <span className="font-medium text-gray-700">Age</span>
                  {editField === "age" ? (
                    <input
                      type="number"
                      value={form.age}
                      onChange={e => setForm({ ...form, age: e.target.value })}
                      className="border rounded px-2 py-1 w-20"
                      onBlur={handleSave}
                      disabled={loading}
                    />
                  ) : (
                    <span className="text-gray-900">{form.age}</span>
                  )}
                  <button onClick={() => setEditField("age")}>
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <span className="font-medium text-gray-700">Gender</span>
                  {editField === "gender" ? (
                    <select
                      value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                      className="border rounded px-2 py-1"
                      onBlur={handleSave}
                      disabled={loading}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <span className="text-gray-900">{form.gender}</span>
                  )}
                  <button onClick={() => setEditField("gender")}>
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}