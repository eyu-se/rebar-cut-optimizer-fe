import { CutPattern } from "@/data/mockData";

const CUT_COLORS = [
  'hsl(213, 70%, 45%)',
  'hsl(213, 60%, 55%)',
  'hsl(200, 65%, 50%)',
  'hsl(190, 55%, 45%)',
  'hsl(220, 50%, 55%)',
  'hsl(230, 45%, 50%)',
];

interface BarVisualizationProps {
  pattern: CutPattern;
  stockLength: number;
}

export function BarVisualization({ pattern, stockLength }: BarVisualizationProps) {
  const totalCutLength = pattern.cuts.reduce((sum, c) => sum + c.length * c.quantity, 0);

  return (
    <div className="mb-4">
      <p className="text-xs font-mono text-muted-foreground mb-1">Bar #{pattern.barId}</p>
      <div className="flex h-9 rounded overflow-hidden border">
        {pattern.cuts.map((cut, i) => {
          const segments = Array.from({ length: cut.quantity }, (_, qi) => (
            <div
              key={`${i}-${qi}`}
              className="bar-segment border-r border-card/30"
              style={{
                width: `${(cut.length / stockLength) * 100}%`,
                backgroundColor: CUT_COLORS[i % CUT_COLORS.length],
                color: '#fff',
              }}
              title={`${cut.length}mm`}
            >
              {(cut.length / stockLength) * 100 > 8 && (
                <span className="truncate px-1">{cut.length}</span>
              )}
            </div>
          ));
          return segments;
        })}
        {pattern.scrap > 0 && (
          <div
            className="bar-segment bg-scrap/20 text-scrap"
            style={{ width: `${(pattern.scrap / stockLength) * 100}%` }}
            title={`Scrap: ${pattern.scrap}mm`}
          >
            {(pattern.scrap / stockLength) * 100 > 5 && (
              <span className="truncate px-1 text-xs">{pattern.scrap}</span>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-1 text-xs text-muted-foreground font-mono">
        <span>Cuts: {pattern.cuts.map(c => `${c.length}mm × ${c.quantity}`).join(' + ')}</span>
        <span className={pattern.scrap > 500 ? 'text-scrap font-medium' : ''}>
          Scrap: {pattern.scrap}mm
        </span>
      </div>
    </div>
  );
}
