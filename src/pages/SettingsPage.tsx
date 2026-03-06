import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit, Trash2 } from "lucide-react";
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

  const [editingUser, setEditingUser] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings");
      return response.data;
    },
  });

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
  });

  const isAdmin = currentUser?.role === "ADMIN";

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data;
    },
    enabled: isAdmin,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
      toast.success("User updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update user");
    }
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

  if (isLoading || currentUserLoading) {
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


      {isAdmin && (
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">User Management</h2>
          </div>
          {usersLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>User (Email)</th><th>Role</th><th>Member Since</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {users?.map((u: any) => (
                  <tr key={u.id}>
                    <td>{u.email} {u.id === currentUser.id && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 rounded-full hidden sm:inline-block">You</span>}</td>
                    <td>{u.role}</td>
                    <td className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setEditingUser({ id: u.id, email: u.email, role: u.role })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                        if (confirm(`Are you sure you want to delete ${u.email}?`)) {
                          deleteUserMutation.mutate(u.id);
                        }
                      }} disabled={u.id === currentUser.id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <Button
        onClick={() => updateMutation.mutate(settings)}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(val) => setEditingUser({ ...editingUser, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                    <SelectItem value="ENGINEER">ENGINEER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>New Password (Optional)</Label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button
              onClick={() => updateUserMutation.mutate({ id: editingUser.id, data: { email: editingUser.email, role: editingUser.role, password: editingUser.password } })}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
