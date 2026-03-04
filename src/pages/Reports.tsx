import { wasteTrend, wasteByDiameter, usageByProject } from "@/data/mockData";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-5">
          <h3 className="font-semibold mb-4">Waste Trend Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 86%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="waste" stroke="hsl(213, 70%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-5">
          <h3 className="font-semibold mb-4">Waste by Diameter</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteByDiameter}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 86%)" />
                <XAxis dataKey="diameter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Bar dataKey="waste" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Stock Usage by Project</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageByProject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 86%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="project" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bars" fill="hsl(213, 70%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
