import { useState } from "react"
import { cn } from "@/lib/utils"
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { format } from "date-fns"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import type { TaskData } from "@/types/task"
import { Textarea } from "../ui/textarea"
export default function AddTaskForm({ onSubmit }: { onSubmit: (task: TaskData) => Promise<void> }) {
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const createTaskSchema = z.object({
        title: z.string().min(1).max(50),
        description: z.string().min(1).max(100),
        category: z.string().min(1).max(50),
        due_date: z.coerce.date(),
        status: z.enum([
            "PENDING",
            "COMPLETED",
            "IN_PROGRESS",
            "CANCELLED",
        ]),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    });

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            category: "",
            due_date: new Date(),
            status: "PENDING" as const,
            priority: "MEDIUM" as const,
        },
        validators: {
            onSubmit: ({ value }) => {
                const result = createTaskSchema.safeParse(value)
                if (!result.success) {
                    const flattened = result.error.flatten()
                    return {
                        formErrors: flattened.formErrors,
                        fieldErrors: Object.fromEntries(
                            Object.entries(flattened.fieldErrors).map(([k, v]) => [
                                k,
                                Array.isArray(v) ? v[0] : v,
                            ])
                        ),
                    }
                }
            },
        },
        onSubmit: async ({ value }) => {
            await onSubmit(value as TaskData)
        }
    })


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <FieldGroup>
                <form.Field
                    name="title"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Task Title</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="Task Title"
                                    autoComplete="off"
                                />
                                <FieldDescription>
                                    Provide a concise title for your task.
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <form.Field
                    name="description"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Task Description</FieldLabel>
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="Task Description"
                                    autoComplete="off"
                                />
                                <FieldDescription>
                                    Provide a concise description for your task.
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <form.Field
                    name="category"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Task Category</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="Task Category"
                                    autoComplete="off"
                                />
                                <FieldDescription>
                                    Provide a concise category for your task.
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <form.Field
                    name="due_date"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        const date = field.state.value

                        const handleDateSelect = (newDate: Date | undefined) => {
                            if (!newDate) return
                            const current = field.state.value
                            const combined = new Date(
                                newDate.getFullYear(),
                                newDate.getMonth(),
                                newDate.getDate(),
                                current.getHours(),
                                current.getMinutes(),
                                current.getSeconds()
                            )
                            field.handleChange(combined)
                            setDatePickerOpen(false)
                        }

                        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const [hours, minutes, seconds] = e.target.value.split(":").map(Number)
                            const current = field.state.value
                            const combined = new Date(
                                current.getFullYear(),
                                current.getMonth(),
                                current.getDate(),
                                hours || 0,
                                minutes || 0,
                                seconds || 0
                            )
                            field.handleChange(combined)
                        }

                        const timeValue = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`

                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor="due-date">Task Due Date</FieldLabel>
                                <div className="flex gap-2">
                                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                        <PopoverTrigger
                                            id="due-date"
                                            className={cn(
                                                "inline-flex h-8 w-36 shrink-0 items-center justify-between gap-1.5 rounded-none border border-border bg-background px-2.5 text-xs font-normal",
                                                "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                "border-border bg-background dark:border-input dark:bg-input/30"
                                            )}
                                        >
                                            {date ? format(date, "PPP") : "Select date"}
                                            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                defaultMonth={date}
                                                onSelect={handleDateSelect}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input
                                        type="time"
                                        id="due-time"
                                        step="1"
                                        value={timeValue}
                                        onBlur={field.handleBlur}
                                        onChange={handleTimeChange}
                                        className="w-32 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                                <FieldDescription>
                                    Provide a due date and time for your task.
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <form.Field
                    name="status"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Task Status</FieldLabel>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(value) => value != null && field.handleChange(value)}
                                >
                                    <SelectTrigger id={field.name} aria-invalid={isInvalid} onBlur={field.handleBlur}>
                                        <SelectValue placeholder="Select a status">
                                            {({ PENDING: "Pending", COMPLETED: "Completed", IN_PROGRESS: "In Progress", CANCELLED: "Cancelled" } as Record<string, string>)[
                                                String(field.state.value)
                                            ] ?? field.state.value}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
                <form.Field
                    name="priority"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Task Priority</FieldLabel>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(value) => value != null && field.handleChange(value)}
                                >
                                    <SelectTrigger id={field.name} aria-invalid={isInvalid} onBlur={field.handleBlur}>
                                        <SelectValue placeholder="Select a priority">
                                        {({ LOW: "Low", MEDIUM: "Medium", HIGH: "High" } as Record<string, string>)[
                                                String(field.state.value)
                                            ] ?? field.state.value}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                />
            </FieldGroup>

            <Button type="submit" className="w-full mt-4">Submit</Button>
        </form>
    )
}