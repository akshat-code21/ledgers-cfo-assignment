import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/types/task"

const STATUS_LABELS: Record<TaskStatus, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    CANCELLED: "Cancelled",
}

export default function TaskCountCard({ taskCount, status }: { taskCount: number, status: TaskStatus }) {
    const styleMap = {
        "PENDING": "bg-yellow-500 text-white",
        "COMPLETED": "bg-green-500 text-white",
        "IN_PROGRESS": "bg-blue-500 text-white",
        "CANCELLED": "bg-red-500 text-white",
    }
    return (
        <div className={cn("w-full h-full p-5 flex flex-col gap-5", styleMap[status as keyof typeof styleMap])}>
            <h1 className="text-2xl font-bold text-white">{STATUS_LABELS[status]}</h1>
            <p className="text-sm text-white">{taskCount} task(s)</p>
        </div>
    )
}