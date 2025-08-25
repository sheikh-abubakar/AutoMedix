import { useState, useEffect } from "react";
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

  // ✅ Fetch patients assigned to doctor
  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    axios
      .get(`/api/prescriptions/doctor/${user._id}/patients`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPatients(res.data);
        } else {
          setPatients([]);
        }
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [user?._id]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit prescription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/prescriptions", form);
      alert("Prescription created successfully!");
      // Optionally reset form
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
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Failed to create prescription.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Create Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading patients...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Date */}
                <input
                  name="date"
                  type="date"
                  className="border rounded px-3 py-2 w-full"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

                {/* Doctor (read-only) */}
                <input
                  value={user?.name || ""}
                  className="border rounded px-3 py-2 w-full bg-gray-100"
                  disabled
                />

                {/* Patient Select */}
                <select
                  name="patient"
                  className="border rounded px-3 py-2 w-full"
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

                {/* Diagnosis */}
                <input
                  name="diagnosis"
                  placeholder="Diagnosis"
                  className="border rounded px-3 py-2 w-full"
                  value={form.diagnosis}
                  onChange={handleChange}
                  required
                />

                {/* Medicine */}
                <input
                  name="medicine"
                  placeholder="Medicine Name"
                  className="border rounded px-3 py-2 w-full"
                  value={form.medicine}
                  onChange={handleChange}
                  required
                />

                {/* Dosage */}
                <input
                  name="dosage"
                  placeholder="Dosage"
                  className="border rounded px-3 py-2 w-full"
                  value={form.dosage}
                  onChange={handleChange}
                  required
                />

                {/* Duration */}
                <input
                  name="duration"
                  placeholder="Duration"
                  className="border rounded px-3 py-2 w-full"
                  value={form.duration}
                  onChange={handleChange}
                  required
                />

                {/* Instructions */}
                <textarea
                  name="instructions"
                  placeholder="Instructions"
                  className="border rounded px-3 py-2 w-full"
                  value={form.instructions}
                  onChange={handleChange}
                />

                <Button type="submit" className="w-full">
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
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Layout from "@/components/Layout";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/hooks/useAuth";

// export default function CreatePrescription() {
//   const { user } = useAuth();
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     date: "",
//     doctor: user?._id || "",
//     patient: "",
//     diagnosis: "",
//     medicine: "",
//     dosage: "",
//     duration: "",
//     instructions: ""
//   });

//   useEffect(() => {
//     if (user?._id) {
//       axios
//         .get(`/api/prescriptions/doctor/${user._id}/patients`)
//         .then(res => setPatients(Array.isArray(res.data) ? res.data : []))
//         .catch(() => setPatients([]))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     await axios.post("/api/prescriptions", form);
//     // Show success toast or redirect
//   };

//   return (
//     <Layout>
//       <div className="max-w-xl mx-auto mt-10">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create Prescription</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="text-center py-8 text-gray-500">Loading patients...</div>
//             ) : (
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 <input name="date" type="date" className="border rounded px-3 py-2 w-full" onChange={handleChange} required />
//                 <input value={user?.name || ""} className="border rounded px-3 py-2 w-full" disabled />
//                 <select name="patient" className="border rounded px-3 py-2 w-full" onChange={handleChange} required>
//                   <option value="">Select Patient</option>
//                   {patients.map(p => (
//                     <option key={p._id} value={p._id}>{p.name}</option>
//                   ))}
//                 </select>
//                 <input name="diagnosis" placeholder="Diagnosis" className="border rounded px-3 py-2 w-full" onChange={handleChange} required />
//                 <input name="medicine" placeholder="Medicine Name" className="border rounded px-3 py-2 w-full" onChange={handleChange} required />
//                 <input name="dosage" placeholder="Dosage" className="border rounded px-3 py-2 w-full" onChange={handleChange} required />
//                 <input name="duration" placeholder="Duration" className="border rounded px-3 py-2 w-full" onChange={handleChange} required />
//                 <textarea name="instructions" placeholder="Instructions" className="border rounded px-3 py-2 w-full" onChange={handleChange} />
//                 <Button type="submit">Create Prescription</Button>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// }