import type { Client, TaskData, TaskStatus } from "@/types/task"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { v1Api } from "@/api/api"
import { Skeleton } from "../ui/skeleton"
import {
    createColumns,
    DataTable,
    isTaskOverdue,
    TASK_TABLE_FILTER_CONFIG,
} from "../workspace/ClientsTable"
import { Button } from "../ui/button"
import { useState } from "react"
import AddTaskModal from "../modals/AddTaskModal"
import { toast } from "sonner"
import TaskCountCard from "../cards/TaskCountCard"
import { PlusIcon } from "lucide-react"

export default function ClientsPage({ activeClient }: {
    activeClient: Client | undefined
}) {

    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const queryClient = useQueryClient()

    const entityTypeMap = {
        "PRIVATE_LIMITED": "Private Limited",
        "PUBLIC": "Public",
        "ONE_PERSON_COMPANY": "One Person Company",
        "LLP": "LLP",
        "NON_PROFIT": "Non-Profit"
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['tasks', activeClient?.id],
        queryFn: () => v1Api.getTasks(activeClient?.id as string),
        enabled: !!activeClient?.id
    })

    const createTaskMutation = useMutation({
        mutationFn: (task: TaskData) => v1Api.createTask(task, activeClient?.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', activeClient?.id] })
            setShowAddTaskModal(false)
            toast.success("Task created successfully")
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
            v1Api.updateTaskStatus(activeClient?.id as string, taskId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', activeClient?.id] })
            toast.success("Status updated successfully")
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    if (!activeClient) return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a client to view tasks</p>
        </div>
    )

    if (isLoading) return (
        <div className="w-full h-full p-6 flex flex-col gap-4">
            <Skeleton className="w-48 h-7 rounded-md" />
            <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="flex-1 h-20 rounded-xl" />
                ))}
            </div>
            <Skeleton className="w-full h-48 rounded-xl" />
        </div>
    )

    if (error) return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-destructive">{(error as Error).message}</p>
        </div>
    )

    if (!data) return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks found</p>
        </div>
    )

    return (
        <div className="w-full h-full p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-heading font-semibold tracking-tight text-foreground">
                        {activeClient?.company_name}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {activeClient?.country} · {entityTypeMap[activeClient?.entity_type as keyof typeof entityTypeMap]} · {(data.data ?? []).length} tasks
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddTaskModal(true)}
                    size="sm"
                >
                    <PlusIcon className="size-4" />
                    Add Task
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <TaskCountCard taskCount={data.metadata.pending} status="PENDING" />
                <TaskCountCard taskCount={data.metadata.completed} status="COMPLETED" />
                <TaskCountCard taskCount={data.metadata.inProgress} status="IN_PROGRESS" />
                <TaskCountCard taskCount={data.metadata.cancelled} status="CANCELLED" />
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-0">
                <DataTable
                    columns={createColumns(updateStatusMutation)}
                    data={data.data ?? []}
                    filterConfig={TASK_TABLE_FILTER_CONFIG}
                    getRowClassName={(row) =>
                        isTaskOverdue(row.original as TaskData)
                            ? "bg-destructive/5 hover:bg-destructive/10"
                            : undefined
                    }
                />
            </div>

            <AddTaskModal
                showAddTaskModal={showAddTaskModal}
                setShowAddTaskModal={setShowAddTaskModal}
                onSubmit={(task) => createTaskMutation.mutateAsync(task) as Promise<void>}
            />
        </div>
    )
}