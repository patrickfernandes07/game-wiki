"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { EquipmentColumn } from "./equipment-columns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EquipmentType } from "@prisma/client";

interface EquipmentFiltersProps {
  table: Table<EquipmentColumn>;
}

const typeOptions = [
  { value: "WEAPON", label: "Arma" },
  { value: "ARMOR", label: "Armadura" },
  { value: "SHIELD", label: "Escudo" },
  { value: "HELMET", label: "Capacete" },
  { value: "LEGS", label: "Calças" },
  { value: "BOOTS", label: "Botas" },
  { value: "AMULET", label: "Amuleto" },
  { value: "RING", label: "Anel" },
];

const vocationOptions = [
  { value: "all", label: "Todas" },
  { value: "none", label: "Sem vocação" },
  { value: "knight", label: "Knight" },
  { value: "paladin", label: "Paladin" },
  { value: "sorcerer", label: "Sorcerer" },
  { value: "druid", label: "Druid" },
];

export function EquipmentFilters({ table }: EquipmentFiltersProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      table.getColumn("type")?.setFilterValue(undefined);
    } else {
      table.getColumn("type")?.setFilterValue([value]);
    }
  };

  const handleVocationChange = (value: string) => {
    if (value === "all") {
      table.getColumn("vocation")?.setFilterValue(["all"]);
    } else {
      table.getColumn("vocation")?.setFilterValue([value]);
    }
  };

  const resetFilters = () => {
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar equipamentos..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9"
          />
        </div>

        <Select
          onValueChange={handleTypeChange}
          value={
            (table.getColumn("type")?.getFilterValue() as string[])?.[0] ??
            "all"
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleVocationChange}
          value={
            (table.getColumn("vocation")?.getFilterValue() as string[])?.[0] ??
            "all"
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Vocação" />
          </SelectTrigger>
          <SelectContent>
            {vocationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-10 px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}