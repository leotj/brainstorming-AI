"use client";

import { useState, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import KnowledgeGraph from "./KnowledgeGraph";

const MAX_CHATS_PER_DAY = 20;

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "system", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    getChatHistory();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    if (!input.trim() || chatCount >= MAX_CHATS_PER_DAY) return;

    const newMessage = { role: "user", text: input };
    setMessages([
      ...messages,
      newMessage,
      { role: "system", text: "Thinking..." },
    ]);

    try {
      const response = await fetch(
        `${process.env.BACKEND_SERVICE_HOST}/conversations`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "system", text: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setInput("");
      setChatCount(chatCount + 1);
      setLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      setLoading(true);
      await fetch(`${process.env.BACKEND_SERVICE_HOST}/conversations/reset`, {
        method: "POST",
        credentials: "include",
      });
      setMessages([
        { role: "system", text: "Hello! How can I assist you today?" },
      ]);
      setChatCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getChatHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.BACKEND_SERVICE_HOST}/conversations`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const text = await response.text();
      if(!text) return;

      const data = JSON.parse(text);
      const history = data.messages.map((e: {role: string, content: string}) => ({
        role: e.role,
        text: e.content
      }));
      setMessages((prev) => prev.concat(history));
      setChatCount(history.length);
    } finally {
      setLoading(false);
    }
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
              className={`p-4 rounded-lg w-full ${
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
          disabled={chatCount >= MAX_CHATS_PER_DAY || !input.trim() || loading === true}
        >
          <Send size={18} />
        </Button>
        <Button
          onClick={resetChat}
          className="bg-red-500 hover:bg-red-600"
          disabled={loading === true || chatCount === 0}
        >
          <RefreshCw size={18} />
        </Button>
      </div>
    </div>
  );
}
