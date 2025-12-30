"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Inbox, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  getDomains, 
  createAccount, 
  getToken, 
  getMessages, 
  getMessage, 
  deleteMessage 
} from "@/lib/mail";

interface Message {
  id: string;
  from: { address: string; name: string };
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
}

export function EmailGenerator() {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const domains = await getDomains();
      if (!domains || domains.length === 0) throw new Error("No domains available");
      
      const domain = domains[0].domain;
      const username = Math.random().toString(36).substring(2, 10);
      const password = Math.random().toString(36).substring(2, 15);
      const address = `${username}@${domain}`;

      await createAccount(address, password);
      const tokenData = await getToken(address, password);
      
      setEmail(address);
      setToken(tokenData.token);
      setMessages([]);
      setSelectedMessage(null);
      
      localStorage.setItem("temp_mail_address", address);
      localStorage.setItem("temp_mail_password", password);
      localStorage.setItem("temp_mail_token", tokenData.token);
      
      toast.success("New email generated!");
    } catch (error) {
      toast.error("Failed to generate email");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!token) return;
    setFetchingMessages(true);
    try {
      const msgs = await getMessages(token);
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setFetchingMessages(false);
    }
  }, [token]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("temp_mail_address");
    const savedToken = localStorage.getItem("temp_mail_token");
    if (savedEmail && savedToken) {
      setEmail(savedEmail);
      setToken(savedToken);
    } else {
      generateEmail();
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [token, fetchMessages]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  const handleViewMessage = async (id: string) => {
    try {
      const msg = await getMessage(id, token);
      setSelectedMessage(msg);
    } catch (error) {
      toast.error("Failed to load message");
    }
  };

  const handleDeleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMessage(id, token);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  return (
    <div className="grid w-full max-w-6xl gap-6 md:grid-cols-12">
      <div className="md:col-span-5 lg:col-span-4">
        <Card className="overflow-hidden border-2 border-zinc-100 shadow-xl dark:border-zinc-800">
          <CardHeader className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5" />
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">Active Address</Badge>
            </div>
            <CardTitle className="text-2xl font-bold">MailTurbo</CardTitle>
            <CardDescription className="text-indigo-100">Your temporary identity is ready.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Email</label>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-3 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                <code className="flex-1 truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {email || "Generating..."}
                </code>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                onClick={generateEmail}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                New Mail
              </Button>
              <Button 
                variant="default" 
                className="w-full gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                onClick={fetchMessages}
                disabled={fetchingMessages}
              >
                <Inbox className={`h-4 w-4 ${fetchingMessages ? "animate-bounce" : ""}`} />
                Check
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Self-destructs in 24h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-7 lg:col-span-8 space-y-4">
        <Card className="h-full min-h-[500px] border-2 border-zinc-100 shadow-xl dark:border-zinc-800 flex flex-col">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Inbox</CardTitle>
                <CardDescription>
                  {messages.length === 0 ? "Waiting for incoming emails..." : `${messages.length} messages received`}
                </CardDescription>
              </div>
              {fetchingMessages && <RefreshCw className="h-4 w-4 animate-spin text-zinc-400" />}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col md:flex-row">
            <div className={`w-full md:w-2/5 border-r border-zinc-100 dark:border-zinc-800 overflow-y-auto max-h-[500px] ${selectedMessage ? "hidden md:block" : "block"}`}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-400">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8" />
                  </div>
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Send an email to your address to see it here</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => handleViewMessage(msg.id)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 ${selectedMessage?.id === msg.id ? "bg-indigo-50 dark:bg-indigo-900/30" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-semibold text-zinc-400 truncate w-2/3">{msg.from.address}</p>
                        <p className="text-[10px] text-zinc-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <h4 className={`text-sm font-semibold truncate ${!msg.seen ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {msg.subject || "(No Subject)"}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{msg.intro}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex-1 overflow-y-auto max-h-[500px] ${selectedMessage ? "block" : "hidden md:flex flex-col items-center justify-center text-zinc-400 p-8"}`}>
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)} className="md:hidden">
                      Back to inbox
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-2 text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30" onClick={(e) => handleDeleteMessage(e, selectedMessage.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{selectedMessage.subject || "(No Subject)"}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs font-normal">From: {selectedMessage.from.name || selectedMessage.from.address}</Badge>
                        <Badge variant="outline" className="text-xs font-normal">{new Date(selectedMessage.createdAt).toLocaleString()}</Badge>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-white border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 min-h-[200px] prose dark:prose-invert max-w-none shadow-inner">
                      {selectedMessage.html ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{selectedMessage.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800">
                    <Inbox className="h-10 w-10 opacity-20" />
                  </div>
                  <p className="font-medium">Select a message to read</p>
                  <p className="text-sm mt-1">Real-time updates enabled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
