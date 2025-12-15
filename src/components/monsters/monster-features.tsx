import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface MonsterFeaturesProps {
  summonable: boolean;
  convinceable: boolean;
  illusionable: boolean;
  pushable: boolean;
  paralysable: boolean;
}

export function MonsterFeatures({
  summonable,
  convinceable,
  illusionable,
  pushable,
  paralysable,
}: MonsterFeaturesProps) {
  const features = [
    { label: 'Summonable', value: summonable },
    { label: 'Convinceable', value: convinceable },
    { label: 'Illusionable', value: illusionable },
    { label: 'Pushable', value: pushable },
    { label: 'Paralysable', value: paralysable },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Características</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge
              key={feature.label}
              variant={feature.value ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {feature.value ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {feature.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}