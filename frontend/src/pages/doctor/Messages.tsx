import { useState, useEffect } from "react";
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
      <div className="p-6 h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your patients</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          {/* Patients List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Patients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {conversations.map(conv => (
                  <div
                    key={conv.partner.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPatient?.id === conv.partner.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedPatient(conv.partner)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.partner.profileImageUrl || ""} />
                        <AvatarFallback>
                          {conv.partner.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conv.partner.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{conv.partner.role === "patient" ? "" : conv.partner.specialization}</p>
                        <p className="text-sm text-gray-700 truncate">
                          {conv.lastMessage?.content}
                        </p>
                      </div>
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
          <Card className="md:col-span-2 flex flex-col">
            {selectedConversation && selectedPatient ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedPatient.profileImageUrl || ""} />
                        <AvatarFallback>
                          {selectedPatient.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedPatient.name}</h3>
                        <p className="text-sm text-gray-600">{selectedPatient.role === "patient" ? "" : selectedPatient.specialization}</p>
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
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            user && msg.senderId === user._id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${user && msg.senderId === user._id ? "text-blue-100" : "text-gray-500"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 min-h-[80px] resize-none"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                      />
                      <Button type="submit" className="self-end"><Send className="h-4 w-4" /></Button>
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