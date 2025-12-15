import { DamageType } from "@prisma/client";

export interface Monster {
  id: string;
  name: string;
  hp: number;
  experience: number;
  speed: number;
  armor: number;
  shielding: number | null;
  summonable: boolean;
  convinceable: boolean;
  illusionable: boolean;
  pushable: boolean;
  paralysable: boolean;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonsterAbility {
  id: string;
  name: string;
  minDamage: number | null;
  maxDamage: number | null;
  type: DamageType | null;
}

export interface ElementalResistance {
  id: string;
  element: DamageType;
  percent: number;
}

export interface MonsterWithDetails extends Monster {
  abilities: MonsterAbility[];
  elementalResistances: ElementalResistance[];
}
