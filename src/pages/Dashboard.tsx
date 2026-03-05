import { KpiCard } from "@/components/KpiCard";
import { Briefcase, Box, Trash2, TrendingDown, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs");
      return response.data;
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/reports/dashboard-stats");
      return response.data;
    },
  });

  if (jobsLoading || statsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { totalJobs = 0, totalBars = 0, totalScrap = 0, avgWastePercent = 0 } = stats || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Jobs" value={totalJobs} subtitle="All time" trend="up" icon={<Briefcase className="h-5 w-5" />} />
        <KpiCard title="Total Stock Bars Used" value={totalBars.toLocaleString()} subtitle="Aggregated" icon={<Box className="h-5 w-5" />} />
        <KpiCard title="Total Scrap" value={`${totalScrap.toLocaleString()} mm`} subtitle="Aggregated" trend="down" icon={<Trash2 className="h-5 w-5" />} />
        <KpiCard
          title="Avg Waste %"
          value={`${avgWastePercent}%`}
          variant={avgWastePercent > 5 ? 'danger' : 'success'}
          subtitle="Target: <5%"
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <h2 className="font-semibold">Recent Optimization Jobs</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-9 h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Project</th>
                <th>Stock Length</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs && jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <tr key={job.id}>
                    <td className="font-medium">{job.name}</td>
                    <td className="text-muted-foreground">{job.projectName || "N/A"}</td>
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
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No jobs found. Create your first optimization!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

