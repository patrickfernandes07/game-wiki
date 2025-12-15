import { config } from "dotenv";
import { Client } from "pg";
import bcrypt from "bcryptjs";
import {
  DamageType,
  ItemCategory,
  EquipmentType,
  EquipmentSlot,
} from "@prisma/client";

config();

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não encontrada");
  }

  console.log("Conectando ao banco...");

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco!");

    // ========== CRIAR USUÁRIO ADMIN ==========
    console.log("\n📝 Verificando usuário admin...");
    const checkUser = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      ["admin@tibiawiki.com"]
    );

    if (checkUser.rows.length > 0) {
      console.log("⚠️  Usuário admin já existe");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await client.query(
        'INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())',
        ["admin@tibiawiki.com", hashedPassword, "Admin", "ADMIN"]
      );
      console.log("✅ Admin user created: admin@tibiawiki.com");
    }

    // ========== ITENS ==========
    console.log("\n📦 Criando itens...");

    const items = [
      // Moedas
      {
        name: "Gold Coin",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 0.1,
        sellPrice: 1,
        imageUrl: null,
      },
      {
        name: "Platinum Coin",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 0.1,
        sellPrice: 100,
        imageUrl: null,
      },
      // Poções
      {
        name: "Great Mana Potion",
        category: ItemCategory.POTION,
        stackable: true,
        weight: 1.9,
        buyPrice: 144,
        sellPrice: 80,
        imageUrl: null,
      },
      {
        name: "Great Health Potion",
        category: ItemCategory.POTION,
        stackable: true,
        weight: 2.0,
        buyPrice: 225,
        sellPrice: 125,
        imageUrl: null,
      },
      // Comida
      {
        name: "Fish",
        category: ItemCategory.FOOD,
        stackable: true,
        weight: 1.5,
        sellPrice: 4,
        imageUrl: null,
      },
      {
        name: "Ham",
        category: ItemCategory.FOOD,
        stackable: true,
        weight: 1.8,
        sellPrice: 8,
        imageUrl: null,
      },
      // Valuables - Frazzlemaw
      {
        name: "Skull",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 7.0,
        sellPrice: 5,
        imageUrl: null,
      },
      {
        name: "Bone",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 2.5,
        sellPrice: 5,
        imageUrl: null,
      },
      {
        name: "Remains of a Fish",
        category: ItemCategory.VALUABLE,
        stackable: false,
        weight: 1.0,
        sellPrice: 5,
        imageUrl: null,
      },
      {
        name: "Frazzle Tongue",
        category: ItemCategory.VALUABLE,
        stackable: false,
        weight: 1.5,
        sellPrice: 700,
        imageUrl: null,
      },
      {
        name: "Frazzle Skin",
        category: ItemCategory.VALUABLE,
        stackable: false,
        weight: 8.5,
        sellPrice: 400,
        imageUrl: null,
      },
      {
        name: "Fairy Wings",
        category: ItemCategory.VALUABLE,
        stackable: false,
        weight: 0.3,
        sellPrice: 200,
        imageUrl: null,
      },
      {
        name: "Piece of Iron",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 0.9,
        sellPrice: 50,
        imageUrl: null,
      },
      {
        name: "Big Bone",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 15.0,
        sellPrice: 20,
        imageUrl: null,
      },
      {
        name: "Iron Ore",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 1.2,
        sellPrice: 50,
        imageUrl: null,
      },
      {
        name: "Fish Fin",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 0.8,
        sellPrice: 150,
        imageUrl: null,
      },
      // Valuables - Silencer
      {
        name: "Assassin Star",
        category: ItemCategory.VALUABLE,
        stackable: true,
        weight: 0.3,
        sellPrice: 100,
        imageUrl: null,
      },
      {
        name: "Silencer Claws",
        category: ItemCategory.VALUABLE,
        stackable: false,
        weight: 9.8,
        sellPrice: 390,
        imageUrl: null,
      },
    ];

    const itemIds: Record<string, string> = {};

    for (const item of items) {
      const existingItem = await client.query(
        'SELECT id FROM "Item" WHERE name = $1',
        [item.name]
      );

      if (existingItem.rows.length > 0) {
        console.log(`⚠️  Item "${item.name}" já existe`);
        itemIds[item.name] = existingItem.rows[0].id;
      } else {
        const result = await client.query(
          `INSERT INTO "Item" (id, name, category, stackable, weight, "buyPrice", "sellPrice", "imageUrl", "createdAt", "updatedAt") 
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
           RETURNING id`,
          [
            item.name,
            item.category,
            item.stackable,
            item.weight,
            item.buyPrice || null,
            item.sellPrice || null,
            item.imageUrl,
          ]
        );
        itemIds[item.name] = result.rows[0].id;
        console.log(`✅ Item criado: ${item.name}`);
      }
    }

    // ========== EQUIPAMENTOS ==========
    console.log("\n⚔️ Criando equipamentos...");

    const equipments = [
      // Frazzlemaw drops
      {
        name: "Nightmare Blade",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 70,
        vocation: "knights",
        attack: 46,
        defense: 28,
        weight: 42.0,
        imageUrl: null,
      },
      {
        name: "Traditional Sai",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 0,
        attack: 35,
        defense: 18,
        weight: 18.0,
        imageUrl: null,
      },
      {
        name: "Cluster of Solace",
        type: EquipmentType.AMULET,
        slot: EquipmentSlot.NECKLACE,
        level: 0,
        weight: 2.5,
        imageUrl: null,
      },
      // Silencer drops
      {
        name: "Stealth Ring",
        type: EquipmentType.RING,
        slot: EquipmentSlot.RING_SLOT,
        level: 0,
        weight: 0.8,
        imageUrl: null,
      },
      {
        name: "Haunted Blade",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 30,
        attack: 42,
        defense: 20,
        weight: 33.0,
        imageUrl: null,
      },
      {
        name: "Terra Legs",
        type: EquipmentType.LEGS,
        slot: EquipmentSlot.LEGS_SLOT,
        level: 60,
        armor: 11,
        weight: 28.0,
        imageUrl: null,
      },
      {
        name: "Terra Boots",
        type: EquipmentType.BOOTS,
        slot: EquipmentSlot.FEET,
        level: 50,
        armor: 3,
        weight: 9.0,
        imageUrl: null,
      },
      {
        name: "Boots of Haste",
        type: EquipmentType.BOOTS,
        slot: EquipmentSlot.FEET,
        level: 0,
        armor: 3,
        weight: 9.0,
        imageUrl: null,
      },
      {
        name: "Diamond Sceptre",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 25,
        attack: 35,
        defense: 20,
        weight: 24.0,
        imageUrl: null,
      },
      {
        name: "Shadow Sceptre",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 35,
        attack: 41,
        defense: 20,
        weight: 22.0,
        imageUrl: null,
      },
      {
        name: "Glorious Axe",
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.TWO_HANDED,
        level: 30,
        vocation: "knights",
        attack: 42,
        defense: 22,
        weight: 80.0,
        imageUrl: null,
      },
    ];

    const equipmentIds: Record<string, string> = {};

    for (const equipment of equipments) {
      const existingEquipment = await client.query(
        'SELECT id FROM "Equipment" WHERE name = $1',
        [equipment.name]
      );

      if (existingEquipment.rows.length > 0) {
        console.log(`⚠️  Equipamento "${equipment.name}" já existe`);
        equipmentIds[equipment.name] = existingEquipment.rows[0].id;
      } else {
        const result = await client.query(
          `INSERT INTO "Equipment" (id, name, type, slot, level, vocation, armor, attack, defense, weight, "imageUrl", "createdAt", "updatedAt") 
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
           RETURNING id`,
          [
            equipment.name,
            equipment.type,
            equipment.slot,
            equipment.level,
            equipment.vocation || null,
            equipment.armor || null,
            equipment.attack || null,
            equipment.defense || null,
            equipment.weight,
            equipment.imageUrl,
          ]
        );
        equipmentIds[equipment.name] = result.rows[0].id;
        console.log(`✅ Equipamento criado: ${equipment.name}`);
      }
    }

    // ========== MONSTROS ==========
    console.log("\n👾 Criando monstros...");

    // Weakened Frazzlemaw
    const frazzlemawData = {
      name: "Weakened Frazzlemaw",
      hp: 3500,
      experience: 2300,
      speed: 200,
      armor: 55,
      shielding: 55,
      summonable: false,
      convinceable: false,
      illusionable: false,
      pushable: false,
      paralysable: false,
      imageUrl:
        "https://static.tibia.com/images/library/weakenedfrazzlemaw.gif",
      description: "Versão enfraquecida do temível Frazzlemaw.",
    };

    let frazzlemawId: string;
    const existingFrazzlemaw = await client.query(
      'SELECT id FROM "Monster" WHERE name = $1',
      [frazzlemawData.name]
    );

    if (existingFrazzlemaw.rows.length > 0) {
      console.log(`⚠️  Monstro "${frazzlemawData.name}" já existe`);
      frazzlemawId = existingFrazzlemaw.rows[0].id;
    } else {
      const result = await client.query(
        `INSERT INTO "Monster" (id, name, hp, experience, speed, armor, shielding, summonable, convinceable, illusionable, pushable, paralysable, "imageUrl", description, "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
         RETURNING id`,
        [
          frazzlemawData.name,
          frazzlemawData.hp,
          frazzlemawData.experience,
          frazzlemawData.speed,
          frazzlemawData.armor,
          frazzlemawData.shielding,
          frazzlemawData.summonable,
          frazzlemawData.convinceable,
          frazzlemawData.illusionable,
          frazzlemawData.pushable,
          frazzlemawData.paralysable,
          frazzlemawData.imageUrl,
          frazzlemawData.description,
        ]
      );
      frazzlemawId = result.rows[0].id;
      console.log(`✅ Monstro criado: ${frazzlemawData.name}`);

      // Abilities
      const frazzlemawAbilities = [
        {
          name: "Melee",
          minDamage: 0,
          maxDamage: 450,
          type: DamageType.PHYSICAL,
        },
        {
          name: "Great Energy Beam",
          minDamage: 300,
          maxDamage: 480,
          type: DamageType.ENERGY,
        },
        {
          name: "Energy Wave",
          minDamage: 250,
          maxDamage: 400,
          type: DamageType.ENERGY,
        },
        { name: "Self Healing", minDamage: 150, maxDamage: 250, type: null },
      ];

      for (const ability of frazzlemawAbilities) {
        await client.query(
          `INSERT INTO "MonsterAbility" (id, "monsterId", name, "minDamage", "maxDamage", type) 
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
          [
            frazzlemawId,
            ability.name,
            ability.minDamage,
            ability.maxDamage,
            ability.type,
          ]
        );
      }
      console.log("  ✅ Habilidades adicionadas");

      // Resistências Elementais (baseado na imagem do Frazzlemaw)
      const frazzlemawResistances = [
        { element: DamageType.PHYSICAL, percent: 95 },
        { element: DamageType.FIRE, percent: 0 }, // Imune
        { element: DamageType.ICE, percent: 105 }, // Fraqueza
        { element: DamageType.ENERGY, percent: 85 },
        { element: DamageType.EARTH, percent: 0 }, // Imune
        { element: DamageType.HOLY, percent: 95 },
        { element: DamageType.DEATH, percent: 0 }, // Imune
      ];

      for (const resistance of frazzlemawResistances) {
        await client.query(
          `INSERT INTO "ElementalResistance" (id, "monsterId", element, percent) 
           VALUES (gen_random_uuid(), $1, $2, $3)`,
          [frazzlemawId, resistance.element, resistance.percent]
        );
      }
      console.log("  ✅ Resistências elementais adicionadas");

      // Loot - Items
      const frazzlemawLoot = [
        { item: "Gold Coin", chance: 100 },
        { item: "Platinum Coin", chance: 100 },
        { item: "Great Mana Potion", chance: 50 },
        { item: "Great Health Potion", chance: 50 },
        { item: "Skull", chance: 30 },
        { item: "Bone", chance: 30 },
        { item: "Remains of a Fish", chance: 25 },
        { item: "Fish", chance: 25 },
        { item: "Ham", chance: 25 },
        { item: "Frazzle Tongue", chance: 15 },
        { item: "Frazzle Skin", chance: 14.5 },
        { item: "Fairy Wings", chance: 12 },
        { item: "Piece of Iron", chance: 10 },
        { item: "Big Bone", chance: 8 },
        { item: "Iron Ore", chance: 7 },
        { item: "Fish Fin", chance: 6 },
      ];

      for (const loot of frazzlemawLoot) {
        if (itemIds[loot.item]) {
          await client.query(
            `INSERT INTO "Loot" (id, "monsterId", "itemId", chance) 
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            [frazzlemawId, itemIds[loot.item], loot.chance]
          );
        }
      }
      console.log("  ✅ Loot (items) adicionado");

      // Loot - Equipments
      const frazzlemawEquipmentLoot = [
        { equipment: "Nightmare Blade", chance: 3 },
        { equipment: "Traditional Sai", chance: 2.5 },
        { equipment: "Cluster of Solace", chance: 2 },
      ];

      for (const loot of frazzlemawEquipmentLoot) {
        if (equipmentIds[loot.equipment]) {
          await client.query(
            `INSERT INTO "EquipmentLoot" (id, "monsterId", "equipmentId", chance) 
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            [frazzlemawId, equipmentIds[loot.equipment], loot.chance]
          );
        }
      }
      console.log("  ✅ Loot (equipamentos) adicionado");
    }

    // Enfeebled Silencer
    const silencerData = {
      name: "Enfeebled Silencer",
      hp: 4800,
      experience: 2950,
      speed: 200,
      armor: 58,
      shielding: 58,
      summonable: false,
      convinceable: false,
      illusionable: false,
      pushable: false,
      paralysable: false,
      imageUrl: "https://static.tibia.com/images/library/enfeebledsilencer.gif",
      description: "Versão enfraquecida do poderoso Silencer.",
    };

    let silencerId: string;
    const existingSilencer = await client.query(
      'SELECT id FROM "Monster" WHERE name = $1',
      [silencerData.name]
    );

    if (existingSilencer.rows.length > 0) {
      console.log(`⚠️  Monstro "${silencerData.name}" já existe`);
      silencerId = existingSilencer.rows[0].id;
    } else {
      const result = await client.query(
        `INSERT INTO "Monster" (id, name, hp, experience, speed, armor, shielding, summonable, convinceable, illusionable, pushable, paralysable, "imageUrl", description, "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
         RETURNING id`,
        [
          silencerData.name,
          silencerData.hp,
          silencerData.experience,
          silencerData.speed,
          silencerData.armor,
          silencerData.shielding,
          silencerData.summonable,
          silencerData.convinceable,
          silencerData.illusionable,
          silencerData.pushable,
          silencerData.paralysable,
          silencerData.imageUrl,
          silencerData.description,
        ]
      );
      silencerId = result.rows[0].id;
      console.log(`✅ Monstro criado: ${silencerData.name}`);

      // Abilities
      const silencerAbilities = [
        {
          name: "Melee",
          minDamage: 0,
          maxDamage: 500,
          type: DamageType.PHYSICAL,
        },
        {
          name: "Death Missile",
          minDamage: 200,
          maxDamage: 450,
          type: DamageType.DEATH,
        },
        {
          name: "Death Wave",
          minDamage: 300,
          maxDamage: 500,
          type: DamageType.DEATH,
        },
        { name: "Mana Drain", minDamage: 50, maxDamage: 150, type: null },
        { name: "Paralysis", minDamage: null, maxDamage: null, type: null },
      ];

      for (const ability of silencerAbilities) {
        await client.query(
          `INSERT INTO "MonsterAbility" (id, "monsterId", name, "minDamage", "maxDamage", type) 
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
          [
            silencerId,
            ability.name,
            ability.minDamage,
            ability.maxDamage,
            ability.type,
          ]
        );
      }
      console.log("  ✅ Habilidades adicionadas");

      // Resistências Elementais (baseado na imagem do Silencer)
      const silencerResistances = [
        { element: DamageType.PHYSICAL, percent: 95 },
        { element: DamageType.FIRE, percent: 40 },
        { element: DamageType.ICE, percent: 0 }, // Imune
        { element: DamageType.ENERGY, percent: 70 },
        { element: DamageType.EARTH, percent: 0 }, // Imune
        { element: DamageType.HOLY, percent: 125 }, // Fraqueza
        { element: DamageType.DEATH, percent: 0 }, // Imune
      ];

      for (const resistance of silencerResistances) {
        await client.query(
          `INSERT INTO "ElementalResistance" (id, "monsterId", element, percent) 
           VALUES (gen_random_uuid(), $1, $2, $3)`,
          [silencerId, resistance.element, resistance.percent]
        );
      }
      console.log("  ✅ Resistências elementais adicionadas");

      // Loot - Items
      const silencerLoot = [
        { item: "Gold Coin", chance: 100 },
        { item: "Platinum Coin", chance: 100 },
        { item: "Assassin Star", chance: 60 },
        { item: "Fairy Wings", chance: 15 },
        { item: "Silencer Claws", chance: 3.5 },
      ];

      for (const loot of silencerLoot) {
        if (itemIds[loot.item]) {
          await client.query(
            `INSERT INTO "Loot" (id, "monsterId", "itemId", chance) 
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            [silencerId, itemIds[loot.item], loot.chance]
          );
        }
      }
      console.log("  ✅ Loot (items) adicionado");

      // Loot - Equipments
      const silencerEquipmentLoot = [
        { equipment: "Stealth Ring", chance: 5 },
        { equipment: "Haunted Blade", chance: 4 },
        { equipment: "Terra Legs", chance: 1.5 },
        { equipment: "Terra Boots", chance: 1.2 },
        { equipment: "Boots of Haste", chance: 1 },
        { equipment: "Diamond Sceptre", chance: 0.8 },
        { equipment: "Shadow Sceptre", chance: 0.5 },
        { equipment: "Glorious Axe", chance: 0.3 },
      ];

      for (const loot of silencerEquipmentLoot) {
        if (equipmentIds[loot.equipment]) {
          await client.query(
            `INSERT INTO "EquipmentLoot" (id, "monsterId", "equipmentId", chance) 
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            [silencerId, equipmentIds[loot.equipment], loot.chance]
          );
        }
      }
      console.log("  ✅ Loot (equipamentos) adicionado");
    }

    console.log("\n✅ Seed concluída com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`  - Admin: admin@tibiawiki.com (senha: admin123)`);
    console.log(`  - Itens: ${items.length}`);
    console.log(`  - Equipamentos: ${equipments.length}`);
    console.log(`  - Monstros: 2 (Weakened Frazzlemaw e Enfeebled Silencer)`);
  } catch (error) {
    console.error("❌ Erro na seed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\nDesconectado do banco");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
