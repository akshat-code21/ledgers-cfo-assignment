import type { Client, TaskData, TaskStatus } from "@/types/task"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { v1Api } from "@/api/api"
import { Skeleton } from "../ui/skeleton"
import { createColumns, DataTable } from "../workspace/ClientsTable"
import { Button } from "../ui/button"
import { useState } from "react"
import AddTaskModal from "../modals/AddTaskModal"
import { toast } from "sonner"

export default function ClientsPage({ activeClient }: {
    activeClient: Client | undefined
}) {

    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const queryClient = useQueryClient()

    const entityTypeMap = {
        "PRIVATE_LIMITED": "PVT",
        "PUBLIC": "PBL",
        "ONE_PERSON_COMPANY": "OPC",
        "LLP": "LLP",
        "NON_PROFIT": "NPO"
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

    if (isLoading) return <Skeleton className="w-full h-full">
        <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
        </div>
    </Skeleton>

    if (error) return <div className="w-full h-full">Error: {(error as Error).message}</div>
    if (!data) return <div className="p-5 w-full h-full">No tasks found</div>

    return <div className="w-full h-full p-5 flex flex-col gap-5">
        <h1 className="text-2xl font-bold">{activeClient?.company_name}</h1>
        <div className="flex justify-between items-center">
            <h2 className="text-sm text-foreground">{activeClient?.country} | {entityTypeMap[activeClient?.entity_type as keyof typeof entityTypeMap]} | {data.length} tasks</h2>
            <Button variant={"secondary"} className="bg-amber-400 text-xl flex flex-col gap-2 border py-3! px-4! rounded-md hover:bg-amber-500" onClick={() => setShowAddTaskModal(true)}>
                <span className="text-sm">Add Task</span>
            </Button>
        </div>
        <div className="flex flex-col gap-2">
            <DataTable
                columns={createColumns(updateStatusMutation)}
                data={data}
            />
        </div>
        <AddTaskModal
            showAddTaskModal={showAddTaskModal}
            setShowAddTaskModal={setShowAddTaskModal}
            onSubmit={(task) => createTaskMutation.mutateAsync(task) as Promise<void>}
        />
    </div>
}