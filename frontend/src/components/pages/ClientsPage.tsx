import type { Client, TaskData } from "@/types/task"
import { useQuery } from "@tanstack/react-query"
import { v1Api } from "@/api/api"
import { Skeleton } from "../ui/skeleton"

export default function ClientsPage({ activeClient }: {
    activeClient: Client | undefined
}) {

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

    if (isLoading) return <Skeleton className="w-full h-full">
        <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
        </div>
    </Skeleton>

    if (error) return <div className="w-full h-full">Error: {error.message}</div>
    if (!data) return <div className="p-5 w-full h-full">No tasks found</div>

    return <div className="w-full h-full p-5 flex flex-col gap-5">
        <h1 className="text-2xl font-bold">{activeClient?.company_name}</h1>
        <h2 className="text-sm text-foreground">{activeClient?.country} | {entityTypeMap[activeClient?.entity_type as keyof typeof entityTypeMap]} | {data.length} tasks</h2>
        <div className="flex flex-col gap-2">
            {data.map((task: TaskData) => (
                <div key={task.id}>{task.title}</div>
            ))}
        </div>
    </div>
}