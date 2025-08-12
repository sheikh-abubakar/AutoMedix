import { useState } from "react";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, MessageCircle, User, Phone, Video } from "lucide-react";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function Messages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  
  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Mock conversations data for demo
  const mockConversations = [
    {
      id: "conv1",
      doctor: {
        id: "doc1",
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        profileImage: null,
      },
      lastMessage: {
        content: "Your test results look good. Please continue your medication.",
        timestamp: "2024-01-15T14:30:00Z",
        isFromDoctor: true,
      },
      unreadCount: 2,
    },
    {
      id: "conv2",
      doctor: {
        id: "doc2",
        name: "Dr. Michael Chen",
        specialization: "Dermatology",
        profileImage: null,
      },
      lastMessage: {
        content: "Thank you doctor. When should I schedule my next appointment?",
        timestamp: "2024-01-14T16:20:00Z",
        isFromDoctor: false,
      },
      unreadCount: 0,
    },
  ];

  // Mock messages for selected conversation
  const mockMessages = selectedDoctor ? [
    {
      id: "msg1",
      senderId: "patient",
      content: "Hello Dr. Johnson, I have some questions about my medication.",
      timestamp: "2024-01-15T14:20:00Z",
      isFromDoctor: false,
    },
    {
      id: "msg2", 
      senderId: "doc1",
      content: "Hello! I'd be happy to help. What questions do you have?",
      timestamp: "2024-01-15T14:22:00Z",
      isFromDoctor: true,
    },
    {
      id: "msg3",
      senderId: "patient",
      content: "I've been experiencing some side effects. Should I be concerned?",
      timestamp: "2024-01-15T14:25:00Z",
      isFromDoctor: false,
    },
    {
      id: "msg4",
      senderId: "doc1",
      content: "Your test results look good. Please continue your medication. The side effects you mentioned are normal and should subside in a few days.",
      timestamp: "2024-01-15T14:30:00Z",
      isFromDoctor: true,
    },
  ] : [];

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      return await apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          receiverId: selectedDoctor,
          content: data.content,
          messageType: "text",
        }),
      });
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Success",
        description: "Message sent successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MessageFormData) => {
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a conversation first.",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate(data);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const selectedConversation = mockConversations.find(conv => conv.doctor.id === selectedDoctor);

  return (
    <Layout>
      <div className="p-6 h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your doctors</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Conversations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {mockConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedDoctor === conversation.doctor.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedDoctor(conversation.doctor.id)}
                    data-testid={`conversation-${conversation.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.doctor.profileImage || ""} />
                        <AvatarFallback>
                          {conversation.doctor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate" data-testid={`doctor-name-${conversation.id}`}>
                            {conversation.doctor.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">{conversation.doctor.specialization}</p>
                        
                        <p className="text-sm text-gray-700 truncate" data-testid={`last-message-${conversation.id}`}>
                          {conversation.lastMessage.isFromDoctor ? "Dr: " : "You: "}
                          {conversation.lastMessage.content}
                        </p>
                        
                        {conversation.unreadCount > 0 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {conversation.unreadCount} new
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              {mockConversations.length === 0 && (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations</h3>
                  <p className="text-gray-600">Start a conversation with a doctor after booking an appointment.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.doctor.profileImage || ""} />
                        <AvatarFallback>
                          {selectedConversation.doctor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900" data-testid="selected-doctor-name">
                          {selectedConversation.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedConversation.doctor.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" data-testid="button-voice-call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" data-testid="button-video-call">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {mockMessages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.isFromDoctor ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isFromDoctor
                                ? "bg-gray-100 text-gray-900"
                                : "bg-blue-500 text-white"
                            }`}
                            data-testid={`message-${message.id}`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isFromDoctor ? "text-gray-500" : "text-blue-100"
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 min-h-[80px] resize-none"
                        {...form.register("content")}
                        data-testid="input-message"
                      />
                      <Button
                        type="submit"
                        disabled={sendMessageMutation.isPending}
                        className="self-end"
                        data-testid="button-send-message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    {form.formState.errors.content && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a doctor from the list to start messaging.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}