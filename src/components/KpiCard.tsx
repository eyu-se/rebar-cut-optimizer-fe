import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export function KpiCard({ title, value, subtitle, icon, trend, variant = 'default' }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={cn(
            "text-2xl font-bold mt-1 font-mono",
            variant === 'success' && 'text-success',
            variant === 'danger' && 'text-scrap',
            variant === 'warning' && 'text-warning',
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {trend === 'up' && <span className="text-scrap">▲</span>}
              {trend === 'down' && <span className="text-success">▼</span>}
              {subtitle}
            </p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
}
