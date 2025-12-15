import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Weight, Package } from 'lucide-react';
import { ItemCategory } from '@prisma/client';

interface ItemInfoProps {
  category: ItemCategory;
  stackable: boolean;
  weight: number;
  buyPrice: number | null;
  sellPrice: number | null;
}

const categoryLabels: Record<ItemCategory, string> = {
  RUNE: 'Runa',
  POTION: 'Poção',
  FOOD: 'Comida',
  TOOL: 'Ferramenta',
  VALUABLE: 'Valioso',
  CONTAINER: 'Contêiner',
  OTHER: 'Outro',
};

export function ItemInfo({
  category,
  stackable,
  weight,
  buyPrice,
  sellPrice,
}: ItemInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="font-medium">{categoryLabels[category]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Weight className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Peso</p>
              <p className="font-medium">{weight} oz</p>
            </div>
          </div>

          {buyPrice !== null && (
            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Preço de Compra</p>
                <p className="font-medium">
                  {buyPrice.toLocaleString('pt-BR')} gp
                </p>
              </div>
            </div>
          )}

          {sellPrice !== null && (
            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Preço de Venda</p>
                <p className="font-medium">
                  {sellPrice.toLocaleString('pt-BR')} gp
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            {stackable ? (
              <Badge variant="default">Empilhável</Badge>
            ) : (
              <Badge variant="secondary">Não Empilhável</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}