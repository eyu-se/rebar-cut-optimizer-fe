import { KpiCard } from "@/components/KpiCard";
import { recentJobs } from "@/data/mockData";
import { Briefcase, Box, Trash2, TrendingDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const totalBars = recentJobs.reduce((s, j) => s + j.totalBarsUsed, 0);
  const avgWaste = (recentJobs.reduce((s, j) => s + j.wastePercent, 0) / recentJobs.length).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Jobs" value={recentJobs.length} subtitle="+2 this week" trend="up" icon={<Briefcase className="h-5 w-5" />} />
        <KpiCard title="Total Stock Bars Used" value={totalBars} subtitle="Last 30 days" icon={<Box className="h-5 w-5" />} />
        <KpiCard title="Total Scrap" value="68,840 mm" subtitle="↓ 12% vs last month" trend="down" icon={<Trash2 className="h-5 w-5" />} />
        <KpiCard
          title="Avg Waste %"
          value={`${avgWaste}%`}
          variant={Number(avgWaste) > 5 ? 'danger' : Number(avgWaste) < 3 ? 'success' : 'default'}
          subtitle="Target: <3%"
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
                <th>Bars Used</th>
                <th>Waste %</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id}>
                  <td className="font-medium">{job.jobName}</td>
                  <td className="text-muted-foreground">{job.projectName}</td>
                  <td className="font-mono">{job.stockLength.toLocaleString()} mm</td>
                  <td className="font-mono">{job.totalBarsUsed}</td>
                  <td>
                    <span className={cn(
                      "font-mono font-medium",
                      job.wastePercent > 5 ? 'text-scrap' : job.wastePercent < 3 ? 'text-success' : 'text-foreground'
                    )}>
                      {job.wastePercent}%
                    </span>
                  </td>
                  <td className="text-muted-foreground">{job.dateCreated}</td>
                  <td>
                    <span className={cn(
                      'status-badge',
                      job.status === 'Draft' && 'status-draft',
                      job.status === 'Optimized' && 'status-optimized',
                      job.status === 'Approved' && 'status-approved',
                    )}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
