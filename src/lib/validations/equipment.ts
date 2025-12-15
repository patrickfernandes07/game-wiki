import { z } from "zod";
import { EquipmentType, EquipmentSlot } from "@prisma/client";

export const equipmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  type: z.nativeEnum(EquipmentType),
  slot: z.nativeEnum(EquipmentSlot),
  level: z.number().min(0, "Level deve ser maior ou igual a 0"),
  vocation: z.string().nullable().optional(),
  armor: z.number().nullable().optional(),
  attack: z.number().nullable().optional(),
  defense: z.number().nullable().optional(),
  range: z.number().nullable().optional(),
  weight: z.number().min(0, "Peso deve ser maior ou igual a 0"),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().max(1000).nullable().optional(),
});

export const equipmentAttributeSchema = z.object({
  attribute: z.string().min(1, "Atributo é obrigatório"),
  value: z.string().min(1, "Valor é obrigatório"),
});

export const equipmentImbuementSchema = z.object({
  slots: z.number().min(0).max(3),
});

export const equipmentFormSchema = z.object({
  equipment: equipmentSchema,
  attributes: z.array(equipmentAttributeSchema),
  imbuements: equipmentImbuementSchema,
});

export type EquipmentFormData = z.infer<typeof equipmentFormSchema>;
