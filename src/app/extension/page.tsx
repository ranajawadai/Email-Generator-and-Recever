"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Inbox, 
  ChevronLeft,
  Zap,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function ExtensionPopup() {
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
      localStorage.setItem("temp_mail_token", tokenData.token);
      
      toast.success("New email generated!");
    } catch (error) {
      toast.error("Generation failed");
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
      console.error(error);
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
    toast.success("Copied!");
  };

  const handleViewMessage = async (id: string) => {
    try {
      const msg = await getMessage(id, token);
      setSelectedMessage(msg);
    } catch (error) {
      toast.error("Load failed");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessage(id, token);
      setMessages(messages.filter((m) => m.id !== id));
      setSelectedMessage(null);
      toast.success("Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-zinc-900 dark:text-white">MailTurbo</span>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">Live</Badge>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedMessage ? (
          <div className="space-y-4 animate-in slide-in-from-right duration-200">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)} className="h-8 gap-1 px-2 -ml-2 text-zinc-500 hover:text-indigo-600">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div>
              <h2 className="text-lg font-bold leading-tight">{selectedMessage.subject || "(No Subject)"}</h2>
              <p className="text-xs text-zinc-500 mt-1">From: {selectedMessage.from.address}</p>
            </div>
            
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm prose dark:prose-invert dark:bg-zinc-900 dark:border-zinc-800">
              {selectedMessage.html ? (
                <div dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
              ) : (
                <p className="whitespace-pre-wrap">{selectedMessage.text}</p>
              )}
            </div>

            <Button variant="destructive" className="w-full gap-2 h-10" onClick={() => handleDeleteMessage(selectedMessage.id)}>
              <Trash2 className="h-4 w-4" />
              Delete Message
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Your Address</label>
                <div className="flex gap-1">
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  <span className="text-[10px] text-zinc-500">Secured</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <code className="flex-1 truncate text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {email || "Generating..."}
                </code>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-7 w-7 hover:bg-white dark:hover:bg-zinc-800">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2 text-xs" onClick={generateEmail} disabled={loading}>
                  <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="secondary" size="sm" className="h-9 gap-2 text-xs" onClick={fetchMessages} disabled={fetchingMessages}>
                  <Inbox className={`h-3 w-3 ${fetchingMessages ? "animate-bounce" : ""}`} />
                  Inbox
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Messages</label>
                {fetchingMessages && <RefreshCw className="h-3 w-3 animate-spin text-zinc-300" />}
              </div>
              
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 py-12 text-center dark:border-zinc-800">
                  <div className="mb-2 rounded-full bg-zinc-50 p-3 dark:bg-zinc-900">
                    <Mail className="h-6 w-6 text-zinc-300" />
                  </div>
                  <p className="text-xs font-medium text-zinc-400">Listening for emails...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => handleViewMessage(msg.id)}
                      className="group cursor-pointer rounded-xl border border-zinc-100 p-3 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-zinc-800 dark:hover:bg-indigo-900/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-zinc-400 truncate w-3/4">{msg.from.address}</span>
                        <span className="text-[10px] text-zinc-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h4 className={`text-xs font-bold truncate ${!msg.seen ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-300"}`}>
                        {msg.subject || "(No Subject)"}
                      </h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-medium">
          <Zap className="h-3 w-3 text-indigo-500" />
          Powered by MailTurbo Engine
        </div>
      </footer>
    </div>
  );
}
