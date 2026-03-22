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
        <div className="grid grid-cols-12 w-full h-screen">
          <div className="col-span-3">
            <ClientsBar activeClient={activeClient} setActiveClient={setActiveClient} />
          </div>
          <div className="col-span-9">
            <ClientsPage activeClient={activeClient} />
          </div>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default App
