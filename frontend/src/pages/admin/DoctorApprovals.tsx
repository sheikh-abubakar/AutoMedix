import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorApprovals = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/approved-doctors")
      .then(res => setDoctors(res.data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Approved Doctors</h2>
        {doctors.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No approved doctors.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Specialization</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Experience</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Resume</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc: any, idx: number) => (
                  <tr key={doc._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-2 px-4 font-semibold">{doc.name}</td>
                    <td className="py-2 px-4 capitalize">{doc.specialization}</td>
                    <td className="py-2 px-4">{doc.email}</td>
                    <td className="py-2 px-4">{doc.experience}</td>
                    <td className="py-2 px-4">
                      {doc.resumeUrl ? (
                        <a
                          href={doc.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline font-medium hover:text-indigo-800 transition"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorApprovals;

