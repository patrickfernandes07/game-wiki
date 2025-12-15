import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MonsterForm } from '@/components/admin/monsters/monster-form';
import type { MonsterFormData } from '@/lib/validations/monster';

async function getMonster(id: string) {
  const monster = await prisma.monster.findUnique({
    where: { id },
    include: {
      abilities: true,
      elementalResistances: true,
    },
  });

  return monster;
}

interface EditMonsterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMonsterPage({ params }: EditMonsterPageProps) {
  const { id } = await params;
  const monster = await getMonster(id);

  if (!monster) {
    notFound();
  }

  // Transform data to match form schema
  const initialData: MonsterFormData = {
    monster: {
      name: monster.name,
      hp: monster.hp,
      experience: monster.experience,
      speed: monster.speed,
      armor: monster.armor,
      shielding: monster.shielding,
      summonable: monster.summonable,
      convinceable: monster.convinceable,
      illusionable: monster.illusionable,
      pushable: monster.pushable,
      paralysable: monster.paralysable,
      imageUrl: monster.imageUrl || '',
      description: monster.description || '',
    },
    abilities: monster.abilities.map((ability) => ({
      name: ability.name,
      minDamage: ability.minDamage,
      maxDamage: ability.maxDamage,
      type: ability.type,
    })),
    elementalResistances: monster.elementalResistances.map((resistance) => ({
      element: resistance.element,
      percent: resistance.percent,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Monstro</h1>
        <p className="text-muted-foreground">
          Atualize as informações do monstro {monster.name}
        </p>
      </div>

      <MonsterForm initialData={initialData} monsterId={id} />
    </div>
  );
}