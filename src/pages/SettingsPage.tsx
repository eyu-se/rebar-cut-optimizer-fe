import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Default Stock Length (mm)</Label><Input type="number" defaultValue={12000} /></div>
          <div><Label>Default Offcut Minimum (mm)</Label><Input type="number" defaultValue={500} /></div>
        </div>
      </section>

      <section className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">Optimization</h2>
        <div className="flex items-center justify-between">
          <div><Label>Allow Mixed Stock Lengths</Label><p className="text-xs text-muted-foreground">Enable optimization across different stock bar lengths</p></div>
          <Switch />
        </div>
        <div><Label>Scrap Threshold Warning (%)</Label><Input type="number" defaultValue={5} className="w-32" /></div>
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

      <Button>Save Changes</Button>
    </div>
  );
}
