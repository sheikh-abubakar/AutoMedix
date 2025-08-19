

export default function DoctorCard({ doctor, onClick }: { doctor: any; onClick: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer" onClick={onClick}>
      <img src={doctor.profileImageUrl} alt={doctor.name} className="w-20 h-20 rounded-full mb-2" />
      <h3 className="font-bold text-lg">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p className="text-gray-500 text-sm">{doctor.experience} years experience</p>
    </div>
  );
}