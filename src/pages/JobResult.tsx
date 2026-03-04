import { KpiCard } from "@/components/KpiCard";
import { BarVisualization } from "@/components/BarVisualization";
import { diameterGroups } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText, Box, Trash2, TrendingUp, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = diameterGroups.map(g => ({ name: `${g.diameter}mm`, waste: g.wastePercent }));

export default function JobResult() {
  const totalBars = diameterGroups.reduce((s, g) => s + g.stockBarsUsed, 0);
  const totalScrap = diameterGroups.reduce((s, g) => s + g.totalScrap, 0);
  const wastePercent = ((totalScrap / (totalBars * 12000)) * 100).toFixed(1);
  const efficiency = (100 - Number(wastePercent)).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foundation Beams - Block A</h1>
          <p className="text-muted-foreground text-sm">Metro Tower Phase 2 — Stock: 12,000mm</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" /> Export Excel</Button>
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-1" /> Print</Button>
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
            <KpiCard title="Total Scrap" value={`${totalScrap.toLocaleString()} mm`} icon={<Trash2 className="h-5 w-5" />} />
            <KpiCard title="Waste %" value={`${wastePercent}%`} variant={Number(wastePercent) > 5 ? 'danger' : 'success'} icon={<TrendingUp className="h-5 w-5" />} />
            <KpiCard title="Efficiency" value={`${efficiency}%`} variant="success" icon={<Gauge className="h-5 w-5" />} />
          </div>

          <div className="bg-card border rounded-lg overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Diameter</th>
                  <th>Required Pieces</th>
                  <th>Stock Bars</th>
                  <th>Total Scrap</th>
                  <th>Waste %</th>
                </tr>
              </thead>
              <tbody>
                {diameterGroups.map(g => (
                  <tr key={g.diameter}>
                    <td className="font-mono font-medium">{g.diameter}mm</td>
                    <td className="font-mono">{g.requiredPieces}</td>
                    <td className="font-mono">{g.stockBarsUsed}</td>
                    <td className="font-mono">{g.totalScrap.toLocaleString()} mm</td>
                    <td>
                      <span className={cn("font-mono font-medium", g.wastePercent > 5 ? 'text-scrap' : g.wastePercent < 3 ? 'text-success' : '')}>
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
            {diameterGroups.map(g => (
              <AccordionItem key={g.diameter} value={`d${g.diameter}`} className="bg-card border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-mono font-bold">Ø{g.diameter}mm</span>
                    <span className="text-muted-foreground">{g.stockBarsUsed} Bars</span>
                    <span className={cn("font-mono", g.wastePercent > 5 ? 'text-scrap' : 'text-success')}>
                      {g.wastePercent}% Waste
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {g.patterns.map(p => (
                    <BarVisualization key={p.barId} pattern={p} stockLength={12000} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="fabrication" className="mt-4">
          <div className="bg-card border rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
              <div><p className="text-muted-foreground text-xs">Job Name</p><p className="font-medium">Foundation Beams - Block A</p></div>
              <div><p className="text-muted-foreground text-xs">Project</p><p className="font-medium">Metro Tower Phase 2</p></div>
              <div><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">2026-03-03</p></div>
              <div><p className="text-muted-foreground text-xs">Stock Length</p><p className="font-medium font-mono">12,000 mm</p></div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Work Code</th>
                  <th>Location</th>
                  <th>Diameter</th>
                  <th>Cutting Combination</th>
                  <th>Stock Used</th>
                  <th>Scrap</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>WC-001</td><td>Grid A1-A4</td><td className="font-mono">10mm</td><td className="font-mono">3000×2 + 2950×2</td><td className="font-mono">1</td><td className="font-mono">100 mm</td></tr>
                <tr><td>WC-001</td><td>Grid A1-A4</td><td className="font-mono">10mm</td><td className="font-mono">4000×3</td><td className="font-mono">1</td><td className="font-mono">0 mm</td></tr>
                <tr><td>WC-002</td><td>Grid B1-B6</td><td className="font-mono">12mm</td><td className="font-mono">6000×2</td><td className="font-mono">1</td><td className="font-mono">0 mm</td></tr>
                <tr><td>WC-002</td><td>Grid B1-B6</td><td className="font-mono">12mm</td><td className="font-mono">7500×1 + 4200×1</td><td className="font-mono">1</td><td className="font-mono">300 mm</td></tr>
                <tr><td>WC-003</td><td>Grid C2-C8</td><td className="font-mono">16mm</td><td className="font-mono">8000×1 + 3800×1</td><td className="font-mono">1</td><td className="font-mono">200 mm</td></tr>
                <tr><td>WC-004</td><td>Grid D1-D3</td><td className="font-mono">20mm</td><td className="font-mono">7500×1 + 3200×1</td><td className="font-mono">1</td><td className="font-mono">1300 mm</td></tr>
                <tr><td>WC-005</td><td>Grid E1-E5</td><td className="font-mono">25mm</td><td className="font-mono">9000×1 + 2500×1</td><td className="font-mono">1</td><td className="font-mono">500 mm</td></tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="mt-4">
          <div className="bg-card border rounded-lg overflow-x-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Raw Cut Data</h3>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Diameter</th>
                  <th>Required Length</th>
                  <th>Quantity</th>
                  <th>Allocated Bar ID</th>
                  <th>Scrap per Bar</th>
                </tr>
              </thead>
              <tbody>
                {diameterGroups.flatMap(g =>
                  g.patterns.flatMap(p =>
                    p.cuts.map((c, ci) => (
                      <tr key={`${g.diameter}-${p.barId}-${ci}`}>
                        <td className="font-mono">{g.diameter}mm</td>
                        <td className="font-mono">{c.length.toLocaleString()} mm</td>
                        <td className="font-mono">{c.quantity}</td>
                        <td className="font-mono">BAR-{String(p.barId).padStart(3, '0')}</td>
                        <td className="font-mono">{p.scrap} mm</td>
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
