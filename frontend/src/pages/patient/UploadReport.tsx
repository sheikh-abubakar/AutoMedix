import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MessageBox from "@/components/MessageBox";
import { useAuth } from "@/hooks/useAuth";

interface Doctor {
  id: string;
  name: string;
  profileImageUrl: string;
  specialization: string;
}

interface Message {
  from: "doctor" | "patient";
  text: string;
}

export default function UploadReport() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [reportStatus, setReportStatus] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/messages/doctors").then(res => setDoctors(res.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedDoctor || !user || !user._id) return;
    const formData = new FormData();
    formData.append("report", file);
    formData.append("doctorId", selectedDoctor.id);
    formData.append("patientId", user._id);
    await axios.post("http://localhost:5000/api/reports/upload", formData, {
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent && progressEvent.total) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      }
    });
    setReportStatus("Report shared successfully!");
  };

  const fetchReportStatus = async () => {
    if (!selectedDoctor || !user || !user._id) return;
    const res = await axios.get(`http://localhost:5000/api/reports/status?doctorId=${selectedDoctor.id}&patientId=${user._id}`);
    if (res.data.viewed) {
      setReportStatus("Your report has been viewed by the doctor.");
    }
  };

  useEffect(() => {
    if (selectedDoctor) fetchReportStatus();
  }, [selectedDoctor]);

  // Fetch messages between patient and selected doctor
  const fetchMessages = async (doctorId: string) => {
    if (!user || !user._id) return;
    const res = await axios.get(`http://localhost:5000/api/messages/conversations/${user._id}`);
    const doctorChat = res.data.find((conv: any) => conv.partner.id === doctorId);
    if (doctorChat) {
      setChat(
        doctorChat.messages.map((msg: any) => ({
          from: msg.senderId === doctorId ? "doctor" : "patient",
          text: msg.content
        }))
      );
    } else {
      setChat([]);
    }
  };

  const handleSendMessage = async () => {
    if (!message || !selectedDoctor || !user || !user._id) return;
    await axios.post("http://localhost:5000/api/messages", {
      senderId: user._id,
      receiverId: selectedDoctor.id,
      content: message
    });
    setMessage("");
    // Fetch latest messages after sending
    await fetchMessages(selectedDoctor.id);
  };

  const openModal = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setUploadProgress(0);
    setFile(null);
    setMessage("");
    setReportStatus("");
    await fetchMessages(doctor.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h2 className="text-2xl font-bold mb-6">Upload Report & Share with Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-6 flex flex-col items-center bg-white shadow">
                <img src={doctor.profileImageUrl} alt={doctor.name} className="w-20 h-20 rounded-full mb-2" />
                <div className="font-semibold text-lg">{doctor.name}</div>
                <div className="text-gray-500 mb-4">{doctor.specialization}</div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => openModal(doctor)}>
                  Share Report
                </Button>
              </div>
            ))}
          </div>

          {/* Modal for sharing report */}
          {showModal && selectedDoctor && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Share Report with <span className="text-blue-600">{selectedDoctor.name}</span></h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose File</label>
                  <input type="file" onChange={handleFileChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {uploadProgress > 0 && <Progress value={uploadProgress} className="mb-4" />}
                <Button onClick={handleUpload} className="mb-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg">Submit</Button>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message to Doctor</label>
                  <MessageBox chat={chat} onSend={handleSendMessage} message={message} setMessage={setMessage} />
                </div>
                {reportStatus && (
                  <div className="mt-2 text-green-600 font-semibold text-center text-base">{reportStatus}</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}