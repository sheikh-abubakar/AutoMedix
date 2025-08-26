import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CreatePrescription() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    doctor: user?._id || "",
    patient: "",
    diagnosis: "",
    medicine: "",
    dosage: "",
    duration: "",
    instructions: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      doctor: user?._id || "",
    }));
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:5000/api/prescriptions/doctor/${user._id}/patients`)
      .then((res) => {
        setPatients(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [user?._id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/prescriptions", form);
      alert("Prescription created successfully!");
      setForm({
        date: "",
        doctor: user?._id || "",
        patient: "",
        diagnosis: "",
        medicine: "",
        dosage: "",
        duration: "",
        instructions: "",
      });
    } catch (error: any) {
      console.error("Error creating prescription:", error?.response?.data || error);
      alert("Failed to create prescription.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-700 mb-2">
              Create Prescription
            </CardTitle>
            <div className="text-gray-500 text-sm mb-2">
              Fill all required fields to create a new prescription for your patient.
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading patients...</div>
            ) : (
              <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <input
                    value={user?.name || ""}
                    className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    name="patient"
                    className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                    value={form.patient}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <input
                    name="diagnosis"
                    placeholder="Diagnosis"
                    className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                    value={form.diagnosis}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                  <input
                    name="medicine"
                    placeholder="Medicine Name"
                    className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                    value={form.medicine}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      name="dosage"
                      placeholder="Dosage"
                      className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                      value={form.dosage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      name="duration"
                      placeholder="Duration"
                      className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                      value={form.duration}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <textarea
                    name="instructions"
                    placeholder="Instructions"
                    className="border rounded px-3 py-2 w-full focus:outline-blue-500"
                    value={form.instructions}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                  Create Prescription
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
