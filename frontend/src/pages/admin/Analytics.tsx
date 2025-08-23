import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchAnalytics();
  }, [token]);

  if (!data) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-full">
            <span className="text-lg text-gray-500">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const appointmentsLabels = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  const appointmentsDataMap = Object.fromEntries(
    data.appointmentsPerDay.map((d: any) => [d._id, d.count])
  );
  const appointmentsCounts = appointmentsLabels.map(
    label => appointmentsDataMap[label] || 0
  );



 const patientRegDataMap = Object.fromEntries(
    (data.patientRegistrationsPerDay || []).map((d: any) => [d._id, d.count])
  );
  const patientRegCounts = appointmentsLabels.map(
    label => patientRegDataMap[label] || 0
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
        <Navbar />
        <div className="p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Website Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-indigo-600">{data.totalUsers}</span>
              <span className="mt-2 text-lg text-gray-700">Total Users</span>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-green-600">{data.totalDoctors}</span>
              <span className="mt-2 text-lg text-gray-700">Total Doctors</span>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-blue-600">{data.totalPatients}</span>
              <span className="mt-2 text-lg text-gray-700">Total Patients</span>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-orange-600">{data.dailyActiveUsers}</span>
              <span className="mt-2 text-lg text-gray-700">Daily Active Users</span>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-purple-600">{data.totalAppointments}</span>
              <span className="mt-2 text-lg text-gray-700">Total Appointments</span>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-teal-600">{data.approvedDoctors}</span>
              <span className="mt-2 text-lg text-gray-700">Approved Doctors</span>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Appointments Trend (Last 14 Days)</h3>
              <Line
                data={{
                  labels: appointmentsLabels,
                  datasets: [
                    {
                      label: "Appointments",
                      data: appointmentsCounts,
                      borderColor: "#6366f1",
                      backgroundColor: "rgba(99,102,241,0.2)",
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Patient Registrations (Last 14 Days)</h3>
              <Bar
                data={{
                  labels: appointmentsLabels,
                  datasets: [
                    {
                      label: "Patients Registered",
                      data: patientRegCounts,
                      backgroundColor: "rgba(34,197,94,0.7)",
                      borderColor: "#22c55e",
                      borderWidth: 2,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { display: false } },
                  },
                }}
              />
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Doctor Status</h3>
              <Doughnut
                data={{
                  labels: ["Approved", "Pending"],
                  datasets: [
                    {
                      data: [data.approvedDoctors, data.pendingDoctors],
                      backgroundColor: ["#34d399", "#fbbf24"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}