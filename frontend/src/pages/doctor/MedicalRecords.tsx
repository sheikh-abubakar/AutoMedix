import { useEffect, useState } from "react";
import axios from "axios";
import MessageBox from "@/components/MessageBox";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

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
  <div className="p-8 flex flex-col items-center min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)' }}>
      <h2 className="mb-8 text-4xl font-extrabold text-center tracking-wide text-sky-700 drop-shadow-lg" style={{ letterSpacing: '2px', textTransform: 'uppercase', marginTop: '40px' }}>
        <span style={{ borderBottom: '4px solid #0288d1', paddingBottom: '6px', borderRadius: '4px' }}>Received Reports</span>
      </h2>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-center" style={{ marginTop: '0px' }}>
        {reports.map(report => (
          <div key={report._id} className="border rounded-xl p-6 bg-white shadow flex flex-col gap-2">
            <div className="font-semibold text-lg mb-1">From: <span className="text-blue-700">{report.patientName}</span></div>
            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline font-medium mb-2">Download/View Report</a>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mt-2" onClick={() => setSelectedReport(report)}>Open Chat</Button>
          </div>
        ))}
      </div>
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setSelectedReport(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">Chat with <span className="text-blue-700">{selectedReport.patientName}</span></h3>
            <Button
              onClick={async () => {
                await handleReview();
                // Send review notification to patient via message
                if (!user || !user._id) return;
                await axios.post("http://localhost:5000/api/messages", {
                  senderId: user._id,
                  receiverId: selectedReport.patientId,
                  content: "Your report has been reviewed by the doctor."
                });
                //window.alert('Patient will see: Your report is reviewed by doctor.');
              }}
              className="mb-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
            >
              Mark as Reviewed
            </Button>
            <div className="mb-4 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
              {chat.map((msg, idx) => (
                <div key={idx} className={`mb-1 ${msg.from === "doctor" ? "text-blue-600" : "text-green-600"}`}>
                  <b>{msg.from === "doctor" ? "Doctor:" : "Patient:"}</b> {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                placeholder="Type your message..."
              />
              <Button
                onClick={async () => {
                  await handleSendMessage();
                  // Optionally, refresh chat from backend after sending
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}