import { ItemCategory } from "@prisma/client";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  stackable: boolean;
  weight: number;
  buyPrice: number | null;
  sellPrice: number | null;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemWithMonsters extends Item {
  loot: Array<{
    id: string;
    chance: number;
    monster: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }>;
}
