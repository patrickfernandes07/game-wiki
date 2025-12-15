"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EquipmentType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Shield, Sword, Eye } from "lucide-react";

export type EquipmentColumn = {
  id: string;
  name: string;
  type: EquipmentType;
  level: number;
  vocation: string | null;
  imageUrl: string | null;
  armor: number | null;
  attack: number | null;
  defense: number | null;
};

const typeColors: Record<EquipmentType, string> = {
  WEAPON: "bg-red-500",
  ARMOR: "bg-blue-500",
  SHIELD: "bg-purple-500",
  HELMET: "bg-cyan-500",
  LEGS: "bg-green-500",
  BOOTS: "bg-yellow-500",
  AMULET: "bg-pink-500",
  RING: "bg-orange-500",
};

const typeLabels: Record<EquipmentType, string> = {
  WEAPON: "Arma",
  ARMOR: "Armadura",
  SHIELD: "Escudo",
  HELMET: "Capacete",
  LEGS: "Calças",
  BOOTS: "Botas",
  AMULET: "Amuleto",
  RING: "Anel",
};

export const columns: ColumnDef<EquipmentColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | null;
      const name = row.getValue("name") as string;
      
      return (
        <div className="flex items-center justify-center w-12 h-12">
          {imageUrl ? (
            <div className="relative w-12 h-12">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as EquipmentType;
      return (
        <Badge className={`${typeColors[type]} text-white`}>
          {typeLabels[type]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue("level") as number;
      return level > 0 ? <div>{level}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "vocation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vocação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vocation = row.getValue("vocation") as string | null;
      return vocation ? (
        <div className="capitalize">{vocation}</div>
      ) : (
        <div className="text-muted-foreground">Todas</div>
      );
    },
    filterFn: (row, id, value) => {
      const vocation = row.getValue(id) as string | null;
      if (value.includes("all")) return true;
      if (value.includes("none") && !vocation) return true;
      return vocation && value.includes(vocation);
    },
  },
  {
    accessorKey: "armor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Shield className="mr-2 h-4 w-4 text-gray-500" />
          Armor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const armor = row.getValue("armor") as number | null;
      return armor ? <div>{armor}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "attack",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Sword className="mr-2 h-4 w-4 text-red-500" />
          Attack
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const attack = row.getValue("attack") as number | null;
      return attack ? <div>{attack}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: "defense",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Shield className="mr-2 h-4 w-4 text-green-500" />
          Defense
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const defense = row.getValue("defense") as number | null;
      return defense ? <div>{defense}</div> : <div className="text-muted-foreground">-</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const equipment = row.original;

      return (
        <Link href={`/equipment/${equipment.id}`}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalhes</span>
          </Button>
        </Link>
      );
    },
  },
];