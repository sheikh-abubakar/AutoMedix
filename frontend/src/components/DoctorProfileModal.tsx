import React from "react";

export default function DoctorProfileModal({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-10 flex flex-col items-center animate-slide-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={doctor.profileImageUrl || "/default-avatar.png"}
          alt={doctor.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-[#3299a8] shadow-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-[#3299a8] mb-1">{doctor.name}</h2>
        <span className="text-lg text-gray-600 font-semibold mb-2">{doctor.specialization || "N/A"}</span>
        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Experience:</span>
            <span>{doctor.experience ? `${doctor.experience} years` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Email:</span>
            <span>{doctor.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Qualifications:</span>
            <span>{doctor.qualifications || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Hospital Address:</span>
            <span>{doctor.hospitalAddress || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Bio:</span>
            <span>{doctor.bio || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Consultation Fee:</span>
            <span>{doctor.consultationFee ? `Rs. ${doctor.consultationFee}` : "N/A"}</span>
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-[#3299a8] text-white rounded-lg font-semibold shadow hover:bg-[#1cb6c4] transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}