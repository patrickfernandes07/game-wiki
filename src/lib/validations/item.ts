import { z } from "zod";
import { ItemCategory } from "@prisma/client";

export const itemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  category: z.nativeEnum(ItemCategory),
  stackable: z.boolean(),
  weight: z.number().min(0, "Peso deve ser maior ou igual a 0"),
  buyPrice: z.number().nullable().optional(),
  sellPrice: z.number().nullable().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().max(1000).nullable().optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
