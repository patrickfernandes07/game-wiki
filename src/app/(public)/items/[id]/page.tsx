import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ItemInfo } from '@/components/items/item-info';
import { ChevronLeft } from 'lucide-react';
import { ItemCategory } from '@prisma/client';

async function getItem(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      loot: {
        include: {
          monster: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          chance: 'desc',
        },
      },
    },
  });

  return item;
}

interface ItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

const categoryColors: Record<ItemCategory, string> = {
  RUNE: 'bg-purple-500',
  POTION: 'bg-red-500',
  FOOD: 'bg-green-500',
  TOOL: 'bg-blue-500',
  VALUABLE: 'bg-yellow-500',
  CONTAINER: 'bg-orange-500',
  OTHER: 'bg-gray-500',
};

const categoryLabels: Record<ItemCategory, string> = {
  RUNE: 'Runa',
  POTION: 'Poção',
  FOOD: 'Comida',
  TOOL: 'Ferramenta',
  VALUABLE: 'Valioso',
  CONTAINER: 'Contêiner',
  OTHER: 'Outro',
};

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/items">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Itens
          </Link>
        </Button>

        <div className="flex items-start gap-6">
          {item.imageUrl ? (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">📦</span>
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
              <Badge className={`${categoryColors[item.category]} text-white`}>
                {categoryLabels[item.category]}
              </Badge>
            </div>
            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}
          </div>
        </div>
      </div>

      <ItemInfo
        category={item.category}
        stackable={item.stackable}
        weight={item.weight}
        buyPrice={item.buyPrice}
        sellPrice={item.sellPrice}
      />

      {item.loot.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Dropped by</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {item.loot.map((loot) => (
                <Link
                  key={loot.id}
                  href={`/monsters/${loot.monster.id}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {loot.monster.imageUrl ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={loot.monster.imageUrl}
                          alt={loot.monster.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                        <span className="text-lg">👾</span>
                      </div>
                    )}
                    <span className="font-medium">{loot.monster.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {loot.chance}%
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: ItemPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return {
      title: 'Item não encontrado',
    };
  }

  return {
    title: `${item.name} - Tibia Wiki`,
    description: item.description || `Informações sobre ${item.name}`,
  };
}