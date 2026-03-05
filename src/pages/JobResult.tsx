import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Download, Printer, FileText, Box, Trash2, TrendingUp, Gauge } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { BarVisualization } from "@/components/BarVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function JobResult() {
  const { id } = useParams();

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["job-summary", id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}/summary`);
      return response.data;
    },
  });

  const { data: patterns, isLoading: loadingPatterns } = useQuery({
    queryKey: ["job-patterns", id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}/patterns`);
      return response.data;
    },
  });

  const handleExportExcel = async () => {
    try {
      const response = await api.get(`/jobs/${id}/export/excel`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fabrication-report-${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.success("Excel report exported successfully");
    } catch (error) {
      toast.error("Failed to export Excel report");
    }
  };

  if (loadingSummary || loadingPatterns) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { totalBars, totalScrap, wastePercent, efficiency } = summary || {};
  const diameterGroupsArr = patterns || [];
  const chartData = diameterGroupsArr.map((g: any) => ({
    name: `${g.diameterMm}mm`,
    waste: g.wastePercent
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{summary?.jobName || "Optimization Result"}</h1>
          <p className="text-muted-foreground text-sm">Stock: {summary?.stockLengthMm?.toLocaleString()}mm</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled><Download className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}><FileText className="h-4 w-4 mr-1" /> Export Excel</Button>
          <Button variant="outline" size="sm" disabled><Printer className="h-4 w-4 mr-1" /> Print</Button>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="patterns">Cut Patterns</TabsTrigger>
          <TabsTrigger value="fabrication">Fabrication Sheet</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-4">
          <div className="grid grid-cols-4 gap-4">
            <KpiCard title="Stock Bars Used" value={totalBars} icon={<Box className="h-5 w-5" />} />
            <KpiCard title="Total Scrap" value={`${totalScrap?.toLocaleString()} mm`} icon={<Trash2 className="h-5 w-5" />} />
            <KpiCard title="Waste %" value={`${wastePercent}%`} variant={Number(wastePercent) > 5 ? 'danger' : 'success'} icon={<TrendingUp className="h-5 w-5" />} />
            <KpiCard title="Efficiency" value={`${efficiency}%`} variant="success" icon={<Gauge className="h-5 w-5" />} />
          </div>

          <div className="bg-card border rounded-lg overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Diameter</th>
                  <th>Stock Bars</th>
                  <th>Total Scrap</th>
                  <th>Waste %</th>
                </tr>
              </thead>
              <tbody>
                {diameterGroupsArr.map((g: any) => (
                  <tr key={g.diameterMm}>
                    <td className="font-mono font-medium">{g.diameterMm}mm</td>
                    <td className="font-mono">{g.stockBarsUsed}</td>
                    <td className="font-mono">{g.totalScrap?.toLocaleString()} mm</td>
                    <td>
                      <span className={cn("font-mono font-medium", (g.wastePercent || 0) > 5 ? 'text-scrap' : (g.wastePercent || 0) < 3 ? 'text-success' : '')}>
                        {g.wastePercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Waste % by Diameter</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 86%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="waste" fill="hsl(213, 70%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="mt-4 space-y-2">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Cut Patterns by Diameter</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Expand All</Button>
              <Button variant="outline" size="sm">Filter High Scrap</Button>
            </div>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {diameterGroupsArr.map((g: any) => (
              <AccordionItem key={g.diameterMm} value={`d${g.diameterMm}`} className="bg-card border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-mono font-bold">Ø{g.diameterMm}mm</span>
                    <span className="text-muted-foreground">{g.stockBarsUsed} Bars</span>
                    <span className={cn("font-mono", g.wastePercent > 5 ? 'text-scrap' : 'text-success')}>
                      {g.wastePercent}% Waste
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {g.patterns.map((p: any) => (
                    <BarVisualization key={p.barId} pattern={p} stockLength={summary?.stockLengthMm || 12000} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="fabrication" className="mt-4">
          <div className="bg-card border rounded-lg p-6 text-center py-12 text-muted-foreground">
            <h3 className="font-semibold text-foreground mb-2">Fabrication Sheet</h3>
            <p>Use the "Export Excel" button above to download the full fabrication details.</p>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="mt-4">
          <div className="bg-card border rounded-lg overflow-x-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Raw Cut Data</h3>
              <Button variant="outline" size="sm" onClick={handleExportExcel}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Diameter</th>
                  <th>Length</th>
                  <th>Quantity</th>
                  <th>Bar ID</th>
                </tr>
              </thead>
              <tbody>
                {diameterGroupsArr.flatMap((g: any) =>
                  g.patterns.flatMap((p: any) =>
                    p.cuts.map((c: any, ci: number) => (
                      <tr key={`${g.diameterMm}-${p.barId}-${ci}`}>
                        <td className="font-mono">{g.diameterMm}mm</td>
                        <td className="font-mono">{c.length?.toLocaleString()} mm</td>
                        <td className="font-mono">1</td>
                        <td className="font-mono">BAR-{String(p.barId || '').padStart(3, '0')}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
