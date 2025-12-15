import { prisma } from '@/lib/prisma';
import { ItemCard } from '@/components/items/item-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

async function getItems() {
  const items = await prisma.item.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      category: true,
      stackable: true,
      weight: true,
      buyPrice: true,
      sellPrice: true,
      imageUrl: true,
    },
  });

  return items;
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Itens</h1>
        <p className="text-muted-foreground">
          Explore runas, poções, comidas e outros itens do Tibia
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar itens..." className="pl-9" disabled />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum item cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}