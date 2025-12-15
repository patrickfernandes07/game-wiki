"use client";

import { DataTable } from "../ui/data-table";
import { columns, EquipmentColumn } from "./equipment-columns";
import { EquipmentFilters } from "./equipment-filters";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import * as React from "react";

interface EquipmentTableProps {
  data: EquipmentColumn[];
}

export function EquipmentTable({ data }: EquipmentTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  return (
    <div className="space-y-4">
      <EquipmentFilters table={table} />
      <DataTable
        columns={columns}
        data={data}
        filterComponent={null}
      />
    </div>
  );
}