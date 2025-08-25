import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

type PrescriptionType = {
  _id: string;
  prescriptionId: string;
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
  useEffect(() => {
    if (user?._id) {
      axios.get(`/api/prescriptions/patient/${user._id}`).then(res => setPrescriptions(res.data));
    }
  }, [user]);
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>My Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <div>No prescriptions found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(p => (
                    <tr key={p._id}>
                      <td>{p.prescriptionId}</td>
                      <td>{p.date}</td>
                      <td>{p.doctor?.name}</td>
                      <td>{p.diagnosis}</td>
                      <td>{p.medicine}</td>
                      <td>{p.dosage}</td>
                      <td>{p.duration}</td>
                      <td>{p.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}