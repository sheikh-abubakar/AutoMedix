import { useEffect, useState } from "react";
import axios from "axios";
import MessageBox from "@/components/MessageBox";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";
import Layout from "@/components/Layout"; // Import Layout

interface Report {
  _id: string;
  patientName: string;
  fileUrl: string;
  patientId: string;
}

interface Message {
  from: "doctor" | "patient";
  text: string;
}

export default function MedicalRecords() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/reports/doctor/${user._id}`).then(res => setReports(res.data));
    }
  }, [user]);

  useEffect(() => {
    if (selectedReport && user) {
      // Fetch messages for the selected doctor
      axios.get(`http://localhost:5000/api/messages/conversations/${user._id}`).then(res => {
        // Find the conversation with the doctor and set chat
        const doctorChat = res.data.find((conv: any) => conv.partner.id === selectedReport.patientId);
        setChat(doctorChat ? doctorChat.messages : []);
      });
    }
  }, [selectedReport, user]);

  const handleSendMessage = async () => {
    if (!message || !selectedReport || !user || !user._id) return;
    await axios.post("http://localhost:5000/api/messages", {
      senderId: user._id,
      receiverId: selectedReport.patientId,
      content: message
    });
    setMessage("");
    // Fetch latest messages after sending
    axios.get(`http://localhost:5000/api/messages/conversations/${user._id}`).then(res => {
      const doctorChat = res.data.find((conv: any) => conv.partner.id === selectedReport.patientId);
      setChat(doctorChat ? doctorChat.messages.map((msg: any) => ({
        from: msg.senderId === user._id ? "doctor" : "patient",
        text: msg.content
      })) : []);
    });
  };

  const handleReview = async () => {
    if (!selectedReport) return;
    await axios.post("http://localhost:5000/api/reports/reviewed", {
      reportId: selectedReport._id
    });
    alert("Report marked as reviewed!");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-white to-[#d0ebf8] py-12 px-4 flex flex-col items-center">
        <h2 className="mb-10 text-4xl font-extrabold text-center text-[#3299a8] tracking-wide drop-shadow-lg uppercase">
          <span className="border-b-4 border-[#3299a8] pb-2 rounded">Received Reports</span>
        </h2>
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map(report => (
            <div
              key={report._id}
              className="rounded-2xl shadow-lg bg-white p-6 flex flex-col items-start hover:shadow-2xl hover:scale-[1.03] transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-[#3299a8] w-6 h-6" />
                <span className="font-semibold text-lg text-gray-700">
                  <span className="text-[#3299a8]">From:</span> {report.patientName}
                </span>
              </div>
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3299a8] underline font-medium mb-4 hover:text-[#217a8a] transition"
              >
                Download/View Report
              </a>
              <Button
                className="bg-[#3299a8] hover:bg-[#217a8a] text-white rounded-lg py-2 px-4 font-semibold mt-auto shadow hover:shadow-lg transition"
                onClick={() => setSelectedReport(report)}
              >
                Open Chat
              </Button>
            </div>
          ))}
        </div>
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl relative border border-gray-100 flex flex-col">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-[#3299a8] text-2xl font-bold"
                onClick={() => setSelectedReport(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center mb-4">
                <User className="w-12 h-12 text-[#3299a8] mb-2" />
                <h3 className="text-2xl font-bold text-center text-[#3299a8]">
                  Chat with <span className="text-[#217a8a]">{selectedReport.patientName}</span>
                </h3>
              </div>
              <hr className="mb-4" />
              <Button
                onClick={async () => {
                  await handleReview();
                  if (!user || !user._id) return;
                  await axios.post("http://localhost:5000/api/messages", {
                    senderId: user._id,
                    receiverId: selectedReport.patientId,
                    content: "Your report has been reviewed by the doctor."
                  });
                }}
                className="mb-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow"
              >
                Mark as Reviewed
              </Button>
              <div className="mb-4 max-h-56 overflow-y-auto flex flex-col gap-3 px-2 py-2 bg-gray-50 rounded-xl border">
                {chat.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === "doctor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-5 py-3 rounded-2xl max-w-xs shadow ${
                        msg.from === "doctor"
                          ? "bg-[#3299a8] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <span className="font-semibold text-xs block mb-1">
                        {msg.from === "doctor" ? "Doctor" : "Patient"}
                      </span>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="border rounded-lg px-3 py-2 flex-1 focus:border-[#3299a8] focus:ring-[#3299a8] outline-none"
                  placeholder="Type your message..."
                />
                <Button
                  onClick={async () => {
                    await handleSendMessage();
                  }}
                  className="bg-[#3299a8] hover:bg-[#217a8a] text-white font-semibold px-6 rounded-lg shadow"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}