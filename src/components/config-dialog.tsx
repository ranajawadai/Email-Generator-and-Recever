"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Key, Globe, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ConfigDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { config, setConfig, setWorkflows } = useAppStore();
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    setConfig({ apiUrl, apiKey });
    onOpenChange(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/n8n/workflows", {
        headers: {
          "x-n8n-api-url": apiUrl,
          "x-n8n-api-key": apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult("success");
        if (data.data) {
          setWorkflows(data.data);
        }
      } else {
        const error = await response.json().catch(() => ({ error: "Connection failed" }));
        setTestResult("error");
        setErrorMessage(error.error || "Connection failed");
      }
    } catch {
      setTestResult("error");
      setErrorMessage("Network error. Check your n8n instance URL.");
    }
    
    setTesting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            n8n Connection Settings
          </DialogTitle>
          <DialogDescription>
            Configure your n8n instance connection to enable workflow management.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              API URL
            </label>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/api/v1"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your n8n instance API endpoint (usually ends with /api/v1)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="n8n_api_xxxxxxxxxx"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Found in n8n Settings → API → Create API Key
            </p>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              testResult === "success" 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            }`}>
              {testResult === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Connection successful. Workflows loaded.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errorMessage || "Connection failed"}</span>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !apiUrl || !apiKey}
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          <Button onClick={handleSave} disabled={!apiUrl || !apiKey}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
