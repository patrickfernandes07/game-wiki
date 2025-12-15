import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonsterStats } from '@/components/monsters/monster-stats';
import { MonsterAbilities } from '@/components/monsters/monster-abilities';
import { ChevronLeft } from 'lucide-react';

async function getMonster(id: string) {
  const monster = await prisma.monster.findUnique({
    where: { id },
    include: {
      abilities: {
        orderBy: {
          name: 'asc',
        },
      },
      elementalResistances: {
        orderBy: {
          element: 'asc',
        },
      },
      loot: {
        include: {
          item: true,
        },
        orderBy: {
          chance: 'desc',
        },
      },
      equipmentLoot: {
        include: {
          equipment: true,
        },
        orderBy: {
          chance: 'desc',
        },
      },
    },
  });

  return monster;
}

interface MonsterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MonsterPage({ params }: MonsterPageProps) {
  const { id } = await params;
  const monster = await getMonster(id);

  if (!monster) {
    notFound();
  }

  // Combinar items e equipments no loot
  const allLoot = [
    ...monster.loot.map(l => ({
      id: l.id,
      name: l.item.name,
      chance: l.chance,
      imageUrl: l.item.imageUrl,
      type: 'item' as const,
    })),
    ...monster.equipmentLoot.map(l => ({
      id: l.id,
      name: l.equipment.name,
      chance: l.chance,
      imageUrl: l.equipment.imageUrl,
      type: 'equipment' as const,
    })),
  ].sort((a, b) => b.chance - a.chance);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/monsters">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Monstros
          </Link>
        </Button>

        <div className="flex items-start gap-6">
          {monster.imageUrl ? (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={monster.imageUrl}
                alt={monster.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">👾</span>
            </div>
          )}

          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {monster.name}
            </h1>
            {monster.description && (
              <p className="text-muted-foreground">{monster.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonsterStats
          hp={monster.hp}
          experience={monster.experience}
          speed={monster.speed}
          armor={monster.armor}
          shielding={monster.shielding}
          summonable={monster.summonable}
          convinceable={monster.convinceable}
          illusionable={monster.illusionable}
          pushable={monster.pushable}
          paralysable={monster.paralysable}
          elementalResistances={monster.elementalResistances}
        />
        <MonsterAbilities abilities={monster.abilities} />
      </div>

      {/* Loot */}
      {allLoot.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Loot</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allLoot.map((loot) => (
                <div
                  key={loot.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {loot.imageUrl ? (
                      <div className="relative w-8 h-8">
                        <Image
                          src={loot.imageUrl}
                          alt={loot.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                        <span className="text-sm">
                          {loot.type === 'equipment' ? '⚔️' : '📦'}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-sm">{loot.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-semibold">
                    {loot.chance}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: MonsterPageProps) {
  const { id } = await params;
  const monster = await getMonster(id);

  if (!monster) {
    return {
      title: 'Monstro não encontrado',
    };
  }

  return {
    title: `${monster.name} - Tibia Wiki`,
    description: monster.description || `Informações sobre ${monster.name}`,
  };
}