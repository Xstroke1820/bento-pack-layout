import { LayoutItem } from "@/utils/bentoLayout";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  items: LayoutItem[];
  columns?: number;
  className?: string;
}

export function BentoGrid({ items, columns = 6, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="bento-card bg-card relative overflow-hidden group"
          style={{
            gridColumn: `${item.colStart} / span ${item.colSpan}`,
            gridRow: `${item.rowStart} / span ${item.rowSpan}`,
          }}
        >
          <img
            src={item.src}
            alt={`Grid item ${item.id}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}
