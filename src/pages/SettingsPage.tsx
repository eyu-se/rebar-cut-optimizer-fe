import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState({
    defaultStockLengthMm: 12000,
    defaultMinOffcutMm: 500,
    allowMixedStockLengths: false,
    scrapThresholdWarning: 5,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings");
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings({
        defaultStockLengthMm: data.defaultStockLengthMm,
        defaultMinOffcutMm: data.defaultMinOffcutMm,
        allowMixedStockLengths: data.allowMixedStockLengths,
        scrapThresholdWarning: data.scrapThresholdWarning,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: typeof settings) => {
      const response = await api.put("/settings", updatedSettings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleChange = (field: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Default Stock Length (mm)</Label>
            <Input
              type="number"
              value={settings.defaultStockLengthMm}
              onChange={(e) => handleChange("defaultStockLengthMm", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Default Offcut Minimum (mm)</Label>
            <Input
              type="number"
              value={settings.defaultMinOffcutMm}
              onChange={(e) => handleChange("defaultMinOffcutMm", Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Optimization</h2>
        <div className="flex items-center justify-between">
          <div>
            <Label>Allow Mixed Stock Lengths</Label>
            <p className="text-xs text-muted-foreground">Enable optimization across different stock bar lengths</p>
          </div>
          <Switch
            checked={settings.allowMixedStockLengths}
            onCheckedChange={(checked) => handleChange("allowMixedStockLengths", checked)}
          />
        </div>
        <div>
          <Label>Scrap Threshold Warning (%)</Label>
          <Input
            type="number"
            className="w-32"
            value={settings.scrapThresholdWarning}
            onChange={(e) => handleChange("scrapThresholdWarning", Number(e.target.value))}
          />
        </div>
      </section>


      <section className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">User Management</h2>
        <table className="data-table">
          <thead><tr><th>User</th><th>Role</th><th>Permissions</th></tr></thead>
          <tbody>
            <tr><td>Ahmed Khan</td><td>Admin</td><td className="text-muted-foreground">Full Access</td></tr>
            <tr><td>Fatima Al-Rashid</td><td>Fabrication Manager</td><td className="text-muted-foreground">Create, View, Approve</td></tr>
            <tr><td>Raj Patel</td><td>Site Engineer</td><td className="text-muted-foreground">Create, View</td></tr>
          </tbody>
        </table>
      </section>

      <Button
        onClick={() => updateMutation.mutate(settings)}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}
