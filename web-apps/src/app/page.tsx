"use client";

import { useState } from "react";
import { Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import KnowledgeGraph from "./KnowledgeGraph";

const MAX_CHATS_PER_DAY = 20;

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [chatCount, setChatCount] = useState(0);

  const sendMessage = () => {
    if (!input.trim() || chatCount >= MAX_CHATS_PER_DAY) return;

    const newMessage = { role: "user", text: input };
    setMessages([...messages, newMessage, { role: "ai", text: "Thinking..." }]);
    setInput("");
    setChatCount(chatCount + 1);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", text: "Here’s your answer!" },
      ]);
    }, 1500);
  };

  const resetChat = () => {
    setMessages([{ role: "ai", text: "Hello! How can I assist you today?" }]);
    setChatCount(0);
  };

  return (
    <div className="flex h-screen">
      {/* Chat History */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Chat History</h2>
        <Card className="space-y-2 shadow-none border-none">
          {messages.map((msg, i) => (
            <CardContent
              key={i}
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.text}
            </CardContent>
          ))}
        </Card>
      </div>

      {/* Knowledge Graph */}
      <div className="w-2/3 flex flex-col p-4">
        <h2 className="text-lg font-bold mb-2">Knowledge Graph</h2>
        <div className="flex-1 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <KnowledgeGraph />
        </div>
      </div>

      {/* Chat Input & Controls */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex items-center gap-2 border-t bg-gray-100 dark:bg-gray-800">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Remaining chats: {MAX_CHATS_PER_DAY - chatCount}
        </span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={chatCount >= MAX_CHATS_PER_DAY}
        >
          <Send size={18} />
        </Button>
        <Button onClick={resetChat} className="bg-red-500 hover:bg-red-600">
          <RefreshCw size={18} />
        </Button>
      </div>
    </div>
  );
}
