import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function OffcutInventory() {
  const queryClient = useQueryClient();

  const { data: offcuts, isLoading } = useQuery({
    queryKey: ["offcuts"],
    queryFn: async () => {
      const response = await api.get("/offcuts");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/offcuts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offcuts"] });
      toast.success("Offcut deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete offcut");
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const offcutList = offcuts || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reusable Offcuts</h1>
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search offcuts..." className="pl-9 h-9" />
          </div>
          <select className="border rounded px-3 py-1 text-sm bg-card">
            <option>All Diameters</option>
            <option>10mm</option>
            <option>12mm</option>
            <option>16mm</option>
            <option>20mm</option>
            <option>25mm</option>
          </select>
          <select className="border rounded px-3 py-1 text-sm bg-card">
            <option>All Statuses</option>
            <option>Available</option>
            <option>Used</option>
            <option>Reserved</option>
          </select>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Diameter</th>
              <th>Length</th>
              <th>Qty</th>
              <th>Source Job</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offcutList.length > 0 ? (
              offcutList.map((o: any) => (
                <tr key={o.id}>
                  <td className="font-mono font-medium">{o.diameter}mm</td>
                  <td className="font-mono">{o.length.toLocaleString()} mm</td>
                  <td className="font-mono">{o.quantity}</td>
                  <td className="text-muted-foreground">{o.sourceJob}</td>
                  <td>
                    <span className={cn('status-badge',
                      o.status === 'Available' && 'status-approved',
                      o.status === 'Used' && 'status-draft',
                      o.status === 'Reserved' && 'status-optimized',
                    )}>{o.status}</span>
                  </td>
                  <td className="text-muted-foreground">{o.createdDate}</td>
                  <td className="flex gap-1">
                    <Button variant="outline" size="sm">Reserve</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-scrap"
                      onClick={() => deleteMutation.mutate(o.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  No reusable offcuts found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
