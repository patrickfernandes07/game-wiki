import { prisma } from '@/lib/prisma';
import { MonsterCard } from '@/components/monsters/monster-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

async function getMonsters() {
  const monsters = await prisma.monster.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      hp: true,
      experience: true,
      imageUrl: true,
    },
  });

  return monsters;
}

export default async function MonstersPage() {
  const monsters = await getMonsters();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Monstros</h1>
        <p className="text-muted-foreground">
          Explore a lista completa de criaturas do Tibia
        </p>
      </div>

      {/* Search - vamos implementar com client component depois */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar monstros..."
          className="pl-9"
          disabled
        />
      </div>

      {monsters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum monstro cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {monsters.map((monster) => (
            <MonsterCard key={monster.id} {...monster} />
          ))}
        </div>
      )}
    </div>
  );
}