import React from "react";
import { Button } from "@/components/ui/button";

interface Message {
  from: "doctor" | "patient";
  text: string;
}

interface MessageBoxProps {
  chat: Message[];
  onSend: () => void;
  message: string;
  setMessage: (msg: string) => void;
}

export default function MessageBox({ chat, onSend, message, setMessage }: MessageBoxProps) {
  return (
    <div className="border-t pt-4">
      <div className="mb-2">
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${msg.from === "doctor" ? "text-blue-600" : "text-green-600"}`}>
            <b>{msg.from === "doctor" ? "Doctor:" : "You:"}</b> {msg.text}
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
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}