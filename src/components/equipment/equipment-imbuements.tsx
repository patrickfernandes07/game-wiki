import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem } from 'lucide-react';

interface EquipmentImbuement {
  id: string;
  slots: number;
}

interface EquipmentImbuementsProps {
  imbuements: EquipmentImbuement[];
}

export function EquipmentImbuements({ imbuements }: EquipmentImbuementsProps) {
  if (imbuements.length === 0 || imbuements[0].slots === 0) {
    return null;
  }

  const totalSlots = imbuements[0].slots;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-purple-500" />
          Slots de Imbuement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {totalSlots} {totalSlots === 1 ? 'slot' : 'slots'}
          </Badge>
          <p className="text-sm text-muted-foreground">
            disponíveis para imbuements
          </p>
        </div>
      </CardContent>
    </Card>
  );
}