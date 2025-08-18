import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorApprovals = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/approved-doctors")
      .then(res => setDoctors(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approved Doctors</h2>
      {doctors.length === 0 ? (
        <p>No approved doctors.</p>
      ) : (
        <ul className="space-y-2">
          {doctors.map((doc: any) => (
            <li key={doc._id} className="border-b pb-2">
              <span className="font-semibold">{doc.name}</span> - {doc.specialization}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorApprovals;

