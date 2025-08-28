import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await axios.post("http://localhost:5000/api/messages/contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1200&q=80')", // Doctor with stethoscope
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/80 p-10 rounded-xl shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Contact Us</h2>
          <p className="mb-8 text-gray-600">
            For any queries or support, reach out to us!
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-indigo-500" />
              <span>4671 Sugar Camp Road, Owatonna, Minnesota, 55060</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-indigo-500" />
              <span>561-456-2321</span>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-indigo-500" />
              <span>admin@email.com</span>
            </div>
          </div>
        </div>
        <Card className="p-8 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4">Send Message</h3>
          {success && (
            <div className="mb-4 text-green-600 font-medium">Message sent successfully!</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-b p-2 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b p-2 outline-none"
              required
            />
            <textarea
              name="message"
              placeholder="Type your Message..."
              value={form.message}
              onChange={handleChange}
              className="w-full border-b p-2 outline-none"
              required
            />
            <Button type="submit" className="w-full bg-indigo-500 text-white">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}