import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface EquipmentAttribute {
  id: string;
  attribute: string;
  value: string;
}

interface EquipmentAttributesProps {
  attributes: EquipmentAttribute[];
}

export function EquipmentAttributes({ attributes }: EquipmentAttributesProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Atributos Especiais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attributes.map((attr) => (
            <div
              key={attr.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <span className="font-medium">{attr.attribute}</span>
              <span className="text-muted-foreground">{attr.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}