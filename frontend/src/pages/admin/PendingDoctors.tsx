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

  const handleReject = async (id: string) => {
    await axios.post(`http://localhost:5000/api/admin/reject-doctor/${id}`);
    fetchPendingDoctors();
  };

  const handleDownloadResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pending Doctor Approvals</h2>
        <button onClick={onClose} className="text-red-500 font-bold">Close</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : doctors.length === 0 ? (
        <p>No pending doctors.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Specialization</th>
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.experience}</td>
                <td>{doc.specialization}</td>
                <td>
                  <button
                    onClick={() => handleDownloadResume(doc.resumeUrl)}
                    className="text-blue-600 underline"
                  >
                    Download
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleApprove(doc._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(doc._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDoctors;