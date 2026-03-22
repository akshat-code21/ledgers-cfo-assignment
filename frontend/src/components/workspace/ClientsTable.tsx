"use client"

import * as React from "react"
import { format } from "date-fns"
import type { Priority, TaskData, TaskStatus } from "@/types/task"
import type { UseMutationResult } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
} from "@tanstack/react-table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

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

export interface FilterConfig {
  columnId: string
  label: string
  options: { value: string; label: string }[]
}

const ALL_FILTER_VALUE = "all"

export function isTaskOverdue(task: TaskData): boolean {
  const dueDate = typeof task.due_date === "string" ? new Date(task.due_date) : task.due_date
  const isPending = task.status === "PENDING"
  return isPending && dueDate < new Date()
}

export const TASK_TABLE_FILTER_CONFIG: FilterConfig[] = [
  {
    columnId: "status",
    label: "Status",
    options: [
      { value: ALL_FILTER_VALUE, label: "All statuses" },
      ...STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ],
  },
  {
    columnId: "priority",
    label: "Priority",
    options: [
      { value: ALL_FILTER_VALUE, label: "All priorities" },
      ...PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ],
  },
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
        cell: ({ getValue }) => {
            return <span className="font-medium">{getValue() as string}</span>
        },
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ getValue, row }) => {
            const value = getValue() as string | Date
            if (!value) return "-"
            const date = typeof value === "string" ? new Date(value) : value
            const overdue = isTaskOverdue(row.original)
            return (
                <span className={cn(overdue && "font-medium text-destructive")}>
                    {format(date, "PPp")}
                </span>
            )
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
        cell: ({ getValue }) => {
            const value = getValue() as Priority
            const label = PRIORITY_OPTIONS.find((o) => o.value === value)?.label ?? value
            const colorMap: Record<Priority, string> = {
                HIGH: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
                MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300",
            }
            return (
                <span className={cn("status-chip", colorMap[value])}>
                    {label}
                </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        },
        cell: ({ getValue }) => {
            const value = getValue() as TaskStatus
            const label = STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
            const colorMap: Record<TaskStatus, string> = {
                PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
                CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
            }
            return (
                <span className={cn("status-chip", colorMap[value])}>
                    {label}
                </span>
            )
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
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-0",
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
    filterConfig?: FilterConfig[]
    getRowClassName?: (row: Row<TData>) => string | undefined
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterConfig,
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      {filterConfig && filterConfig.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {filterConfig.map(({ columnId, label, options }) => {
              const currentValue = (table.getColumn(columnId)?.getFilterValue() as string) ?? ALL_FILTER_VALUE
              const displayLabel = options.find((o) => o.value === currentValue)?.label ?? `All ${label}`

              return (
            <div key={columnId} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{label}:</span>
              <Select
                value={currentValue}
                onValueChange={(value) =>
                  table.getColumn(columnId)?.setFilterValue(
                    value === ALL_FILTER_VALUE ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-[140px] h-8 normal-case">
                  {displayLabel}
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ value, label: optLabel }) => (
                    <SelectItem key={value} value={value} className="normal-case">
                      {optLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )})}
          </div>
          <span className="text-xs text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {(data ?? []).length} row(s)
          </span>
        </div>
      )}
    <div className="overflow-hidden rounded-xl border border-border/60">
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
                className={getRowClassName?.(row)}
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
    </div>
  )
}