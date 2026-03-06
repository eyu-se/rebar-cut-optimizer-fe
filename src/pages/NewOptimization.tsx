import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import api from "@/lib/api";

const steps = ["Job Setup", "Upload BBS", "Review & Run"];

export default function NewOptimization() {
  const [step, setStep] = useState(0);
  const [jobName, setJobName] = useState("");
  const [projectName, setProjectName] = useState(""); // This isn't in BE yet, I'll just use jobName for now or skip
  const [stockLength, setStockLength] = useState(12000);
  const [minOffcut, setMinOffcut] = useState(500);
  const [allowReuse, setAllowReuse] = useState(true);
  const [optMode, setOptMode] = useState("balanced");
  const [file, setFile] = useState<File | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings");
      return response.data;
    },
  });

  useEffect(() => {
    if (settings) {
      setStockLength(settings.defaultStockLengthMm);
      setMinOffcut(settings.defaultMinOffcutMm);
    }
  }, [settings]);

  const handleCreateJob = async () => {
    try {
      const response = await api.post("/jobs", {
        name: jobName,
        projectName: projectName,
        stockLengthMm: stockLength,
        minOffcutToSaveMm: minOffcut,
        allowOffcutReuse: allowReuse
      });
      setJobId(response.data.id);
      setStep(1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create job",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!file || !jobId) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/jobs/${jobId}/upload`, formData);
      setStep(2);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || "Failed to upload requirements",
        variant: "destructive"
      });
    }
  };

  const handleOptimize = async () => {
    if (!jobId) return;
    setOptimizing(true);
    try {
      await api.post(`/jobs/${jobId}/optimize`);
      toast({ title: "Optimization Complete", description: "Patterns generated successfully" });
      navigate(`/jobs/${jobId}`);
    } catch (error: any) {
      toast({
        title: "Optimization Failed",
        description: error.response?.data?.error || "Failed to run optimization",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">New Optimization</h1>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0",
              i < step ? "bg-success border-success text-success-foreground" :
                i === step ? "border-primary text-primary bg-primary/10" :
                  "border-muted text-muted-foreground"
            )}>
              {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
            </div>
            <span className={cn("text-sm font-medium hidden sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className={cn("flex-1 h-0.5", i < step ? "bg-success" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-lg p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Job Name</Label><Input value={jobName} onChange={e => setJobName(e.target.value)} placeholder="e.g. Foundation Beams - Block A" /></div>
              <div><Label>Project Name</Label><Input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Metro Tower Phase 2" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Stock Length (mm)</Label><Input type="number" value={stockLength} onChange={e => setStockLength(Number(e.target.value))} /></div>
              <div><Label>Minimum Offcut to Save (mm)</Label><Input type="number" value={minOffcut} onChange={e => setMinOffcut(Number(e.target.value))} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={allowReuse} onCheckedChange={setAllowReuse} />
              <Label>Allow Offcut Reuse</Label>
            </div>
            <div>
              <Label className="mb-3 block">Optimization Mode</Label>
              <RadioGroup value={optMode} onValueChange={setOptMode} className="flex gap-4">
                {[
                  { value: 'fast', label: 'Fast (Heuristic)', desc: 'Quick results, good for estimates' },
                  { value: 'balanced', label: 'Balanced', desc: 'Best tradeoff of speed and quality' },
                  { value: 'maximum', label: 'Maximum', desc: 'Best possible result, slower' },
                ].map(m => (
                  <label key={m.value} className={cn(
                    "flex-1 border rounded-lg p-4 cursor-pointer transition-colors",
                    optMode === m.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  )}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={m.value} />
                      <span className="font-medium text-sm">{m.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{m.desc}</p>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
              <Button onClick={handleCreateJob} disabled={!jobName}>Next</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                file ? "border-success bg-success/5" : "border-muted-foreground/30 hover:border-primary/50"
              )}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-10 w-10 text-success" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">Drop BBS Excel file here</p>
                  <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, .csv</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={!file}>Upload & Next</Button>
              </div>
            </div>
          </div>
        )}


        {step === 2 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-lg">Optimization Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Job</p>
                <p className="font-medium mt-1">{jobName}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Project</p>
                <p className="font-medium mt-1">{projectName}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Stock Length</p>
                <p className="font-medium mt-1 font-mono">{stockLength.toLocaleString()} mm</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Optimization Mode</p>
                <p className="font-medium mt-1 capitalize">{optMode}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Unique Diameters</p>
                <p className="font-medium mt-1 font-mono">5</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Pieces</p>
                <p className="font-medium mt-1 font-mono">1,039</p>
              </div>
            </div>

            {optimizing && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Optimizing cutting patterns...</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '65%' }} />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} disabled={optimizing}>Back</Button>
              <Button onClick={handleOptimize} disabled={optimizing}>
                {optimizing ? "Optimizing..." : "Confirm & Optimize"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
