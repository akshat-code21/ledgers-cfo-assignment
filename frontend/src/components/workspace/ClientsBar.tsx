import { useQuery } from "@tanstack/react-query";
import { v1Api } from "@/api/api";
import { Skeleton } from "../ui/skeleton";
import type { Client } from "@/types/task";
import { cn } from "@/lib/utils";

export default function ClientsBar({ activeClient, setActiveClient }: { activeClient: Client | undefined, setActiveClient: (client: Client) => void }) {

    const { data, isLoading, error } = useQuery({
        queryKey: ['clients'],
        queryFn: v1Api.getAllClients,
        staleTime: Infinity
    })

    if (isLoading) return (
        <div className="w-full h-full p-4 flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-10 rounded-lg" />
            ))}
        </div>
    )

    if (error) return <div className="w-full h-full p-4 text-destructive text-sm">Error: {error.message}</div>

    if (!data) return <div className="w-full h-full p-4 text-muted-foreground text-sm">No data</div>

    return (
        <div className="w-full h-full p-3 flex flex-col gap-1 overflow-y-auto">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
                Clients
            </p>
            {data.map((client: Client) => (
                <button
                    key={client.id}
                    className={cn(
                        "cursor-pointer w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                        activeClient?.id === client.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setActiveClient(client)}
                >
                    {client.company_name}
                </button>
            ))}
        </div>
    )
}