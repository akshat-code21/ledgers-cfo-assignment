import "./index.css"
import ClientsBar from "./components/ClientsBar"
import ClientsPage from "./components/pages/ClientsPage"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="grid grid-cols-12 w-full h-screen">
          <div className="col-span-3">
            <ClientsBar />
          </div>
          <div className="col-span-9">
            <ClientsPage />
          </div>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
