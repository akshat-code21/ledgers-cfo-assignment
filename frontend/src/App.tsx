import "./index.css"
import ClientsBar from "./components/workspace/ClientsBar"
import ClientsPage from "./components/pages/ClientsPage"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from "react"
import type { Client } from "./types/task"

const queryClient = new QueryClient()

function App() {
  const [activeClient, setActiveClient] = useState<Client | undefined>(undefined);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col w-full h-screen bg-background">
          <header className="flex items-center px-6 h-12 border-b border-border/60 shrink-0">
            <h1 className="text-sm font-heading font-semibold tracking-tight text-foreground">
              Ledgers CFO
            </h1>
          </header>
          <div className="grid grid-cols-12 flex-1 min-h-0">
            <div className="col-span-3 border-r border-border/60">
              <ClientsBar activeClient={activeClient} setActiveClient={setActiveClient} />
            </div>
            <div className="col-span-9 overflow-y-auto">
              <ClientsPage activeClient={activeClient} />
            </div>
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default App
