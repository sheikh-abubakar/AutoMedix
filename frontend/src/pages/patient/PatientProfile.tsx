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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="max-w-xl mx-auto mt-10">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <img
                src={form.profileImageUrl || "https://ui-avatars.com/api/?name=Patient"}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover mb-2"
              />
              <CardTitle className="text-2xl">{form.name}</CardTitle>
              <p className="text-gray-500">{form.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Age</span>
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
                    <span>{form.age}</span>
                  )}
                  <button onClick={() => setEditField("age")}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gender</span>
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
                    <span>{form.gender}</span>
                  )}
                  <button onClick={() => setEditField("gender")}>
                    <Pencil className="h-4 w-4 text-blue-500" />
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