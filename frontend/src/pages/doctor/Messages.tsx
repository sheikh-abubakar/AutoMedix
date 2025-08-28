import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Phone, Video, User, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ConversationPartner = {
  id: string;
  name: string;
  profileImageUrl?: string;
  role: string;
  specialization?: string;
};

type MessageType = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type ConversationType = {
  partner: ConversationPartner;
  messages: MessageType[];
  lastMessage?: MessageType;
};

export default function DoctorMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<ConversationPartner | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`http://localhost:5000/api/messages/conversations/${user._id}`)
        .then(res => setConversations(res.data));
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      const conv = conversations.find(c => c.partner.id === selectedPatient.id);
      setMessages(conv ? conv.messages : []);
    }
  }, [selectedPatient, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !selectedPatient || !user) return;
    await axios.post("http://localhost:5000/api/messages", {
      senderId: user._id,
      receiverId: selectedPatient.id,
      content,
    });
    setContent("");
    // Refresh messages
    axios.get(`http://localhost:5000/api/messages/conversations/${user._id}`)
      .then(res => setConversations(res.data));
  };

  const selectedConversation = selectedPatient
    ? conversations.find(c => c.partner.id === selectedPatient.id)
    : undefined;

  return (
    <Layout>
      <div className="p-6 h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 text-center">Doctor Chat</h1>
          <p className="text-gray-600 mt-1 text-center">Chat with your patients in a modern interface</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-0">
          {/* Patients List */}
          <Card className="md:col-span-1 shadow-lg border-0 bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <MessageCircle className="h-5 w-5" />
                <span>Patients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[28rem]">
                {conversations.map(conv => (
                  <div
                    key={conv.partner.id}
                    className={`p-4 border-b cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-3 ${
                      selectedPatient?.id === conv.partner.id ? "bg-indigo-100 border-indigo-200" : ""
                    }`}
                    onClick={() => setSelectedPatient(conv.partner)}
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-indigo-200">
                      <AvatarImage src={conv.partner.profileImageUrl || ""} />
                      <AvatarFallback>
                        {conv.partner.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-indigo-900 truncate">{conv.partner.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conv.partner.role === "patient" ? "" : conv.partner.specialization}</p>
                      <p className="text-sm text-gray-700 truncate italic">
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              {conversations.length === 0 && (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
                  <p className="text-gray-600">You will see patients here when they message you.</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col shadow-lg border-0 bg-white/80">
            {selectedConversation && selectedPatient ? (
              <>
                <CardHeader className="border-b bg-indigo-50/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-indigo-200">
                        <AvatarImage src={selectedPatient.profileImageUrl || ""} />
                        <AvatarFallback>
                          {selectedPatient.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-indigo-900">{selectedPatient.name}</h3>
                        <p className="text-xs text-gray-500">{selectedPatient.role === "patient" ? "" : selectedPatient.specialization}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm"><Phone className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm"><Video className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg._id} className={`flex ${user && msg.senderId === user._id ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow ${
                            user && msg.senderId === user._id
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${user && msg.senderId === user._id ? "text-indigo-100" : "text-gray-500"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4 bg-indigo-50/60">
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 min-h-[60px] resize-none rounded-xl border-indigo-200 focus:border-indigo-400"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                      />
                      <Button type="submit" className="self-end bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl">
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a patient</h3>
                  <p className="text-gray-600">Choose a patient from the list to start messaging.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}