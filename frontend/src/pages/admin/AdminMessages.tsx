import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/messages/contact")
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10">
        <Card className="shadow-lg border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 text-2xl">
              <Mail className="h-7 w-7" />
              <span> Queries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No messages found.</div>
            ) : (
              <ul className="space-y-6">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-100 rounded-full p-2">
                        <Mail className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-indigo-800">{msg.name}</span>
                        <span className="ml-2 text-sm text-indigo-600">({msg.email})</span>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2 text-base">{msg.message}</div>
                    <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}