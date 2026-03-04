export interface Job {
  id: string;
  jobName: string;
  projectName: string;
  stockLength: number;
  totalBarsUsed: number;
  wastePercent: number;
  dateCreated: string;
  status: 'Draft' | 'Optimized' | 'Approved';
}

export interface CutPiece {
  length: number;
  quantity: number;
}

export interface CutPattern {
  barId: number;
  cuts: CutPiece[];
  scrap: number;
}

export interface DiameterGroup {
  diameter: number;
  requiredPieces: number;
  stockBarsUsed: number;
  totalScrap: number;
  wastePercent: number;
  patterns: CutPattern[];
}

export interface Offcut {
  id: string;
  diameter: number;
  length: number;
  quantity: number;
  sourceJob: string;
  status: 'Available' | 'Used' | 'Reserved';
  createdDate: string;
}

export const recentJobs: Job[] = [
  { id: '1', jobName: 'Foundation Beams - Block A', projectName: 'Metro Tower Phase 2', stockLength: 12000, totalBarsUsed: 156, wastePercent: 2.8, dateCreated: '2026-03-03', status: 'Approved' },
  { id: '2', jobName: 'Column Ties - Level 3', projectName: 'Metro Tower Phase 2', stockLength: 12000, totalBarsUsed: 89, wastePercent: 4.1, dateCreated: '2026-03-02', status: 'Optimized' },
  { id: '3', jobName: 'Slab Reinforcement B2', projectName: 'Harbour Bridge Expansion', stockLength: 12000, totalBarsUsed: 234, wastePercent: 1.9, dateCreated: '2026-03-01', status: 'Approved' },
  { id: '4', jobName: 'Pile Cage - Zone C', projectName: 'Industrial Park West', stockLength: 12000, totalBarsUsed: 67, wastePercent: 5.3, dateCreated: '2026-02-28', status: 'Draft' },
  { id: '5', jobName: 'Wall Reinforcement L5', projectName: 'Metro Tower Phase 2', stockLength: 12000, totalBarsUsed: 112, wastePercent: 3.4, dateCreated: '2026-02-27', status: 'Optimized' },
  { id: '6', jobName: 'Beam Stirrups - Grid D', projectName: 'Harbour Bridge Expansion', stockLength: 12000, totalBarsUsed: 45, wastePercent: 6.1, dateCreated: '2026-02-25', status: 'Draft' },
];

export const diameterGroups: DiameterGroup[] = [
  {
    diameter: 10,
    requiredPieces: 320,
    stockBarsUsed: 42,
    totalScrap: 12600,
    wastePercent: 2.5,
    patterns: [
      { barId: 1, cuts: [{ length: 3000, quantity: 2 }, { length: 2950, quantity: 2 }], scrap: 100 },
      { barId: 2, cuts: [{ length: 4000, quantity: 3 }], scrap: 0 },
      { barId: 3, cuts: [{ length: 5500, quantity: 1 }, { length: 3200, quantity: 1 }, { length: 2800, quantity: 1 }], scrap: 500 },
    ],
  },
  {
    diameter: 12,
    requiredPieces: 280,
    stockBarsUsed: 56,
    totalScrap: 22400,
    wastePercent: 3.3,
    patterns: [
      { barId: 1, cuts: [{ length: 6000, quantity: 2 }], scrap: 0 },
      { barId: 2, cuts: [{ length: 7500, quantity: 1 }, { length: 4200, quantity: 1 }], scrap: 300 },
      { barId: 3, cuts: [{ length: 3500, quantity: 3 }, { length: 1200, quantity: 1 }], scrap: 300 },
    ],
  },
  {
    diameter: 16,
    requiredPieces: 195,
    stockBarsUsed: 38,
    totalScrap: 15200,
    wastePercent: 3.3,
    patterns: [
      { barId: 1, cuts: [{ length: 8000, quantity: 1 }, { length: 3800, quantity: 1 }], scrap: 200 },
      { barId: 2, cuts: [{ length: 5000, quantity: 2 }, { length: 1500, quantity: 1 }], scrap: 500 },
    ],
  },
  {
    diameter: 20,
    requiredPieces: 148,
    stockBarsUsed: 48,
    totalScrap: 18240,
    wastePercent: 3.2,
    patterns: [
      { barId: 1, cuts: [{ length: 7500, quantity: 1 }, { length: 3200, quantity: 1 }], scrap: 1300 },
      { barId: 2, cuts: [{ length: 6000, quantity: 2 }], scrap: 0 },
    ],
  },
  {
    diameter: 25,
    requiredPieces: 96,
    stockBarsUsed: 32,
    totalScrap: 14400,
    wastePercent: 3.8,
    patterns: [
      { barId: 1, cuts: [{ length: 9000, quantity: 1 }, { length: 2500, quantity: 1 }], scrap: 500 },
    ],
  },
];

export const offcuts: Offcut[] = [
  { id: '1', diameter: 10, length: 2500, quantity: 8, sourceJob: 'Foundation Beams - Block A', status: 'Available', createdDate: '2026-03-03' },
  { id: '2', diameter: 12, length: 1800, quantity: 12, sourceJob: 'Column Ties - Level 3', status: 'Available', createdDate: '2026-03-02' },
  { id: '3', diameter: 16, length: 3200, quantity: 5, sourceJob: 'Slab Reinforcement B2', status: 'Reserved', createdDate: '2026-03-01' },
  { id: '4', diameter: 20, length: 1500, quantity: 15, sourceJob: 'Foundation Beams - Block A', status: 'Used', createdDate: '2026-02-28' },
  { id: '5', diameter: 25, length: 2800, quantity: 3, sourceJob: 'Pile Cage - Zone C', status: 'Available', createdDate: '2026-02-27' },
  { id: '6', diameter: 10, length: 900, quantity: 20, sourceJob: 'Wall Reinforcement L5', status: 'Available', createdDate: '2026-02-26' },
  { id: '7', diameter: 12, length: 4100, quantity: 2, sourceJob: 'Beam Stirrups - Grid D', status: 'Reserved', createdDate: '2026-02-25' },
];

export const wasteTrend = [
  { month: 'Sep', waste: 4.8 },
  { month: 'Oct', waste: 4.2 },
  { month: 'Nov', waste: 3.9 },
  { month: 'Dec', waste: 3.5 },
  { month: 'Jan', waste: 3.1 },
  { month: 'Feb', waste: 2.9 },
  { month: 'Mar', waste: 2.7 },
];

export const wasteByDiameter = [
  { diameter: '10mm', waste: 2.5 },
  { diameter: '12mm', waste: 3.3 },
  { diameter: '16mm', waste: 3.3 },
  { diameter: '20mm', waste: 3.2 },
  { diameter: '25mm', waste: 3.8 },
  { diameter: '32mm', waste: 4.1 },
];

export const usageByProject = [
  { project: 'Metro Tower', bars: 357 },
  { project: 'Harbour Bridge', bars: 279 },
  { project: 'Industrial Park', bars: 112 },
  { project: 'Civic Center', bars: 89 },
];
