import axios from "axios";
import type { TaskData, TaskStatus } from "@/types/task";


const axiosInstance = axios.create({
    baseURL : `${import.meta.env.VITE_API_URL}/api/v1/`
})


export const v1Api = {
    getAllClients: async () => {
        const res = await axiosInstance.get('/clients')
        console.log(res.data);
        return res.data.data
    },
    getTasks: async (clientId: string) => {
        const res = await axiosInstance.get(`/tasks/${clientId}`)
        return res.data
    },
    createTask: async (task: TaskData) => {
        const res = await axiosInstance.post('/tasks', task)
        return res.data
    },
    updateTaskStatus: async (taskId: string, status: TaskStatus) => {
        const res = await axiosInstance.put(`/tasks/${taskId}`, { status })
        return res.data
    }
}