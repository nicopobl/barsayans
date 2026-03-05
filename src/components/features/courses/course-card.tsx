import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  level?: "beginner" | "intermediate" | "advanced";
  className?: string;
}

const levelLabel: Record<NonNullable<CourseCardProps["level"]>, string> = {
  beginner:     "Principiante",
  intermediate: "Intermedio",
  advanced:     "Avanzado",
};

/**
 * Course card for the homepage grid.
 * Hovering lifts the card and reveals the accent glow.
 */
export function CourseCard({
  id,
  title,
  description,
  price,
  thumbnailUrl,
  level,
  className,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-brand-zinc-800",
        "bg-brand-bg-surface shadow-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-card-hover hover:shadow-accent",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-brand-bg-elevated">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">⚡</span>
          </div>
        )}
        {level && (
          <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-brand-accent backdrop-blur-sm">
            {levelLabel[level]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-semibold text-white group-hover:text-brand-accent-300 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="flex-1 text-sm text-brand-zinc-400 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-brand-accent">
            ${price.toLocaleString("es-CL")}
            <span className="ml-1 text-xs font-normal text-brand-zinc-500">CLP</span>
          </span>
          <span className="text-xs font-medium text-brand-zinc-500 group-hover:text-white transition-colors">
            Ver curso →
          </span>
        </div>
      </div>
    </Link>
  );
}
