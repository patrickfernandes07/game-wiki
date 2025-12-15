import { z } from "zod";
import { DamageType } from "@prisma/client";

export const monsterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  hp: z.number().min(1, "HP deve ser maior que 0"),
  experience: z.number().min(0, "Experience deve ser maior ou igual a 0"),
  speed: z.number().min(0, "Speed deve ser maior ou igual a 0"),
  armor: z.number().min(0, "Armor deve ser maior ou igual a 0"),
  shielding: z.number().nullable().optional(),
  summonable: z.boolean(),
  convinceable: z.boolean(),
  illusionable: z.boolean(),
  pushable: z.boolean(),
  paralysable: z.boolean(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().max(1000).nullable().optional(),
});

export const monsterAbilitySchema = z.object({
  name: z.string().min(1, "Nome da habilidade é obrigatório"),
  minDamage: z.number().nullable().optional(),
  maxDamage: z.number().nullable().optional(),
  type: z.nativeEnum(DamageType).nullable().optional(),
});

export const elementalResistanceSchema = z.object({
  element: z.nativeEnum(DamageType),
  percent: z.number().min(0).max(200), // 0 = imune, 100 = normal, >100 = fraqueza
});

export const monsterFormSchema = z.object({
  monster: monsterSchema,
  abilities: z.array(monsterAbilitySchema),
  elementalResistances: z.array(elementalResistanceSchema),
});

export type MonsterFormData = z.infer<typeof monsterFormSchema>;
