import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface LmsSidebarProps {
  courseTitle: string;
  lessons: { id: string; title: string; completed: boolean }[];
  activeLessonId?: string;
}

/**
 * Fixed sidebar for the LMS (course player) layout.
 * Renders lesson list with completion state.
 */
export function LmsSidebar({ courseTitle, lessons, activeLessonId }: LmsSidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-brand-zinc-800 bg-brand-bg-surface">
      {/* Logo */}
      <div className="border-b border-brand-zinc-800 px-6 py-5">
        <Link href="/" className="text-sm font-bold text-brand-accent">
          {APP_NAME}
        </Link>
        <p className="mt-1 text-xs text-brand-zinc-400 line-clamp-2">{courseTitle}</p>
      </div>

      {/* Lesson list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <Link
                href={`?lesson=${lesson.id}`}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  lesson.id === activeLessonId
                    ? "bg-brand-accent/10 text-brand-accent font-medium"
                    : "text-brand-zinc-300 hover:bg-brand-bg-elevated hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    lesson.completed
                      ? "bg-brand-accent text-black"
                      : "border border-brand-zinc-700 text-brand-zinc-500",
                  ].join(" ")}
                >
                  {lesson.completed ? "✓" : index + 1}
                </span>
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
