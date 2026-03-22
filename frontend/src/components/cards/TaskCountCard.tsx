import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/types/task"

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
    PENDING: { label: "Pending", color: "text-amber-600 dark:text-amber-400" },
    COMPLETED: { label: "Completed", color: "text-emerald-600 dark:text-emerald-400" },
    IN_PROGRESS: { label: "In Progress", color: "text-blue-600 dark:text-blue-400" },
    CANCELLED: { label: "Cancelled", color: "text-rose-600 dark:text-rose-400" },
}

export default function TaskCountCard({ taskCount, status }: { taskCount: number, status: TaskStatus }) {
    const config = STATUS_CONFIG[status]

    return (
        <div className="flex-1 p-4 rounded-xl border border-border/50">
            <p className={cn("text-2xl font-heading font-bold tabular-nums", config.color)}>
                {taskCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
                {config.label}
            </p>
        </div>
    )
}