import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";

export default function Jobs() {
  const navigate = useNavigate();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => navigate("/optimize")}><PlusCircle className="h-4 w-4 mr-2" />New Optimization</Button>
      </div>
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-9 h-9" />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Job Name</th><th>Stock Length</th><th>Status</th><th>Date Created</th><th></th></tr>
          </thead>
          <tbody>
            {jobs && jobs.length > 0 ? (
              jobs.map((job: any) => (
                <tr key={job.id}>
                  <td className="font-medium">{job.name}</td>
                  <td className="font-mono">{job.stockLengthMm.toLocaleString()} mm</td>
                  <td>
                    <span className={cn(
                      'status-badge',
                      job.status === 'PENDING' && 'status-draft',
                      job.status === 'COMPLETED' && 'status-optimized',
                      job.status === 'FAILED' && 'status-error',
                    )}>
                      {job.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{format(new Date(job.createdAt), "MMM d, yyyy")}</td>
                  <td><Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>View</Button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

