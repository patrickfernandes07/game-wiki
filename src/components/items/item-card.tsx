import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Weight } from 'lucide-react';
import { ItemCategory } from '@prisma/client';

interface ItemCardProps {
  id: string;
  name: string;
  category: ItemCategory;
  stackable: boolean;
  weight: number;
  buyPrice: number | null;
  sellPrice: number | null;
  imageUrl: string | null;
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

export function ItemCard({
  id,
  name,
  category,
  stackable,
  weight,
  buyPrice,
  sellPrice,
  imageUrl,
}: ItemCardProps) {
  return (
    <Link href={`/items/${id}`}>
      <Card className="hover:border-primary transition-all hover:shadow-lg cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            {imageUrl ? (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{name}</CardTitle>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge className={`${categoryColors[category]} text-white`}>
                  {categoryLabels[category]}
                </Badge>
                {stackable && (
                  <Badge variant="outline">Stackable</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Weight className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{weight}</span>
            <span className="text-muted-foreground">oz</span>
          </div>
          {(buyPrice !== null || sellPrice !== null) && (
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-yellow-500" />
              <div className="flex gap-2">
                {sellPrice !== null && (
                  <span className="font-medium">
                    {sellPrice.toLocaleString('pt-BR')} gp
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}