"use client"

import { format } from "date-fns"
import type { Priority, TaskData, TaskStatus } from "@/types/task"
import type { UseMutationResult } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
]

export const createColumns = (
  updateStatusMutation: UseMutationResult<
    unknown,
    Error,
    { taskId: string; status: TaskStatus }
  >
): ColumnDef<TaskData>[] => [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ getValue }) => {
            const value = getValue() as string | Date
            if (!value) return "-"
            const date = typeof value === "string" ? new Date(value) : value
            return format(date, "PPp")
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => {
            const value = getValue() as Priority
            return PRIORITY_OPTIONS.find((o) => o.value === value)?.label ?? value
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const value = getValue() as TaskStatus
            return STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
        },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        const isUpdating = updateStatusMutation.isPending

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none p-0",
                "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
              disabled={isUpdating}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {STATUS_OPTIONS.map(({ value, label }) => (
                      <DropdownMenuItem
                        key={value}
                        className="normal-case"
                        disabled={task.status === value}
                        onClick={() =>
                          updateStatusMutation.mutate({ taskId: task.id, status: value })
                        }
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}