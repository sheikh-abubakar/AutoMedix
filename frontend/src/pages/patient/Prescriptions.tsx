import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

type PrescriptionType = {
  _id: string;
  date: string;
  doctor?: { name: string };
  diagnosis: string;
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
};

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionType[]>([]);
  const [showInstructions, setShowInstructions] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) {
      axios.get(`http://localhost:5000/api/prescriptions/patient/${user._id}`).then(res => {
        if (Array.isArray(res.data)) {
          setPrescriptions(res.data);
        } else if (Array.isArray(res.data.prescriptions)) {
          setPrescriptions(res.data.prescriptions);
        } else {
          setPrescriptions([]);
        }
      });
    }
  }, [user]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ color: "#02336fff" }}>
              My Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">No prescriptions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead style={{ backgroundColor: "#2563eb" }}>
                    <tr>
                      <th className="py-3 px-4 text-left text-white">Patient Name</th>
                      <th className="py-3 px-4 text-left text-white">Prescribed Medicine</th>
                      <th className="py-3 px-4 text-left text-white">Prescribed By</th>
                      <th className="py-3 px-4 text-left text-white">Diagnosis</th>
                      <th className="py-3 px-4 text-left text-white">Dosage</th>
                      <th className="py-3 px-4 text-left text-white">Duration</th>
                      <th className="py-3 px-4 text-left text-white">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((p, idx) => (
                      <tr key={p._id} style={{ backgroundColor: idx % 2 === 0 ? "#e3edfd" : "#fff" }}>
                        <td className="py-2 px-4 font-medium">{user?.name}</td>
                        <td className="py-2 px-4">{p.medicine}</td>
                        <td className="py-2 px-4">{p.doctor?.name}</td>
                        <td className="py-2 px-4">{p.diagnosis}</td>
                        <td className="py-2 px-4">{p.dosage}</td>
                        <td className="py-2 px-4">{p.duration}</td>
                        <td className="py-2 px-4">
                          <button
                            style={{ backgroundColor: "#2563eb" }}
                            className="text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            onClick={() => setShowInstructions(p.instructions || "No instructions")}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Instructions Modal */}
            {showInstructions && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                  <h2 className="text-lg font-bold mb-2" style={{ color: "#2563eb" }}>Instructions</h2>
                  <p className="text-gray-700 mb-4">{showInstructions}</p>
                  <button
                    style={{ backgroundColor: "#2563eb" }}
                    className="text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setShowInstructions(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}