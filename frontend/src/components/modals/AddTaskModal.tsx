import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddTaskForm from "../forms/AddTaskForm";
import type { TaskData } from "@/types/task";

export default function AddTaskModal({ showAddTaskModal, setShowAddTaskModal, onSubmit }: { showAddTaskModal: boolean, setShowAddTaskModal: (showAddTaskModal: boolean) => void, onSubmit: (task: TaskData) => Promise<void> }) {
    return (
        <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                </DialogHeader>
                <AddTaskForm onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}