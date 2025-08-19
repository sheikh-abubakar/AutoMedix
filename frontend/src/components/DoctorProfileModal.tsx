

export default function DoctorProfileModal({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  if (!doctor) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <img src={doctor.profileImageUrl} alt={doctor.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">{doctor.name}</h2>
        <p className="text-center text-gray-600 mb-2">{doctor.specialization}</p>
        <p className="text-center text-gray-500 mb-2">{doctor.experience} years experience</p>
        <p className="text-center text-gray-500 mb-2">Email: {doctor.email}</p>
        {doctor.resumeUrl && (
          <a href={doctor.resumeUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-indigo-600 underline mb-2">
            View Resume
          </a>
        )}
        {/* Add more doctor details if needed */}
      </div>
    </div>
  );
}