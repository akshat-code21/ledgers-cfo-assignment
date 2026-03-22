import { useQuery } from "@tanstack/react-query";
import { v1Api } from "@/api/api";
import { Skeleton } from "./ui/skeleton";
import type { Client } from "@/types/task";
import { Button } from "./ui/button";

export default function ClientsBar() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['clients'],
        queryFn: v1Api.getAllClients
    })
    if (isLoading) return <Skeleton className="w-full h-full">
        <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
        </div>
    </Skeleton>
    if (error) return <div className="border border-red-500 w-full h-full">Error: {error.message}</div>
    if (!data) return <div className="border border-red-500 w-full h-full">No data</div>
    return <div className="border border-red-500 w-full h-full p-5 flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex flex-col gap-2">
            {data.map((client: Client) => (
                <Button variant={"secondary"} key={client.id} className="bg-amber-400 text-xl flex flex-col gap-2 border p-7 rounded-md hover:bg-amber-500">
                    <h1>{client.company_name}</h1>
                </Button>
            ))}
        </div>
    </div>
}