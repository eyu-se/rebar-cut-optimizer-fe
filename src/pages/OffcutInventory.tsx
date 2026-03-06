import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function OffcutInventory() {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deleteCount, setDeleteCount] = useState<number>(1);

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
      toast.success("Offcut(s) deleted successfully");
      setDeleteModalOpen(false);
      setSelectedGroup(null);
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
                      onClick={() => {
                        setSelectedGroup(o);
                        setDeleteCount(o.quantity); // default to all
                        setDeleteModalOpen(true);
                      }}
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

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Offcuts</DialogTitle>
            <DialogDescription>
              This offcut group has {selectedGroup?.quantity} items available. How many would you like to delete?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Quantity to Delete (Max: {selectedGroup?.quantity})</label>
              <Input
                type="number"
                min={1}
                max={selectedGroup?.quantity || 1}
                value={deleteCount}
                onChange={(e) => setDeleteCount(Math.min(selectedGroup?.quantity || 1, Math.max(1, parseInt(e.target.value) || 1)))}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!selectedGroup) return;
                const idsToDelete = selectedGroup.ids.slice(0, deleteCount).join(',');
                deleteMutation.mutate(idsToDelete);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {deleteCount} {deleteCount === 1 ? 'Item' : 'Items'}
            </Button>
            {selectedGroup?.quantity > 1 && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (!selectedGroup) return;
                  deleteMutation.mutate(selectedGroup.ids.join(','));
                }}
                disabled={deleteMutation.isPending}
              >
                Delete All ({selectedGroup.quantity})
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
