import { EquipmentType, EquipmentSlot } from "@prisma/client";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  slot: EquipmentSlot;
  level: number;
  vocation: string | null;
  armor: number | null;
  attack: number | null;
  defense: number | null;
  range: number | null;
  weight: number;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentAttribute {
  id: string;
  attribute: string;
  value: string;
}

export interface EquipmentImbuement {
  id: string;
  slots: number;
}

export interface EquipmentWithDetails extends Equipment {
  attributes: EquipmentAttribute[];
  imbuements: EquipmentImbuement[];
}
