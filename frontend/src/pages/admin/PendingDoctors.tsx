import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingDoctors = ({ onClose }: { onClose: () => void }) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/admin/pending-doctors");
    setDoctors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/approve-doctor/${id}`);
    fetchPendingDoctors();
  };

  const handleReject = async (doctorId: string) => {
    try {
      await fetch(`http://localhost:5000/api/admin/reject-doctor/${doctorId}`, {
        method: "DELETE",
      });
      // Optionally refresh the list or show a toast
    } catch (err) {
      // Handle error
    }
  };

  const handleDownloadResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">Pending Doctor Approvals</h2>
        <button
          onClick={onClose}
          className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
        >
          Close
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No pending doctors.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Experience</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Specialization</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Resume</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, idx) => (
                <tr key={doc._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4">{doc.name}</td>
                  <td className="py-2 px-4">{doc.email}</td>
                  <td className="py-2 px-4">{doc.experience}</td>
                  <td className="py-2 px-4 capitalize">{doc.specialization}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDownloadResume(doc.resumeUrl)}
                      className="text-indigo-600 underline font-medium hover:text-indigo-800 transition"
                    >
                      Download
                    </button>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(doc._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDoctors;