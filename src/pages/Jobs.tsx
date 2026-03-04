import { recentJobs } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Jobs() {
  const navigate = useNavigate();
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
            <tr><th>Job Name</th><th>Project</th><th>Stock Length</th><th>Bars</th><th>Waste %</th><th>Date</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {recentJobs.map(job => (
              <tr key={job.id}>
                <td className="font-medium">{job.jobName}</td>
                <td className="text-muted-foreground">{job.projectName}</td>
                <td className="font-mono">{job.stockLength.toLocaleString()} mm</td>
                <td className="font-mono">{job.totalBarsUsed}</td>
                <td><span className={cn("font-mono font-medium", job.wastePercent > 5 ? 'text-scrap' : job.wastePercent < 3 ? 'text-success' : '')}>{job.wastePercent}%</span></td>
                <td className="text-muted-foreground">{job.dateCreated}</td>
                <td><span className={cn('status-badge', job.status === 'Draft' && 'status-draft', job.status === 'Optimized' && 'status-optimized', job.status === 'Approved' && 'status-approved')}>{job.status}</span></td>
                <td><Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
