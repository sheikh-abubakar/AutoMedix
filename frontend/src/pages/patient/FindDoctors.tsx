import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "@/components/DoctorCard";
import DoctorProfileModal from "@/components/DoctorProfileModal";
import BookAppointmentModal from "@/components/BookAppointmentModal";
import { useAuth } from "@/hooks/useAuth";

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const { user } = useAuth();

  const fetchDoctors = async (name = "", specialization = "") => {
    const params: any = {};
    if (name) params.name = name;
    if (specialization) params.specialization = specialization;
    const res = await axios.get("http://localhost:5000/api/doctors", { params });
    setDoctors(res.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors(searchName, searchSpecialization);
  };

  const patientId = typeof user?._id === "string" ? user._id : "";

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Find Doctors</h2>
      <p className="mb-6 text-gray-600">Search and book appointments with qualified doctors</p>
      <form className="flex gap-4 mb-6" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-1/3"
        />
        <input
          type="text"
          placeholder="Search by specialization"
          value={searchSpecialization}
          onChange={e => setSearchSpecialization(e.target.value)}
          className="border rounded-lg px-3 py-2 w-1/3"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Search</button>
      </form>
      {doctors.length === 0 ? (
        <div className="flex flex-col items-center mt-16">
          <h3 className="text-lg font-semibold text-gray-700">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doctor: any) => (
            <div key={doctor._id}>
              <DoctorCard doctor={doctor} onClick={() => setSelectedDoctor(doctor)} />
              <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded" onClick={() => setBookingDoctor(doctor)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
      <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <BookAppointmentModal
        doctor={bookingDoctor}
        patientId={patientId}
        onClose={() => setBookingDoctor(null)}
        onBooked={() => setBookingDoctor(null)}
      />
    </div>
  );
}