import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DamageType } from '@prisma/client';

interface MonsterAbility {
  id: string;
  name: string;
  minDamage: number | null;
  maxDamage: number | null;
  type: DamageType | null;
}

interface MonsterAbilitiesProps {
  abilities: MonsterAbility[];
}

const damageTypeColors: Record<DamageType, string> = {
  PHYSICAL: 'bg-gray-500',
  FIRE: 'bg-red-500',
  ICE: 'bg-blue-500',
  ENERGY: 'bg-purple-500',
  EARTH: 'bg-green-500',
  HOLY: 'bg-yellow-500',
  DEATH: 'bg-black',
};

const damageTypeLabels: Record<DamageType, string> = {
  PHYSICAL: 'Físico',
  FIRE: 'Fogo',
  ICE: 'Gelo',
  ENERGY: 'Energia',
  EARTH: 'Terra',
  HOLY: 'Sagrado',
  DEATH: 'Morte',
};

export function MonsterAbilities({ abilities }: MonsterAbilitiesProps) {
  if (abilities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Habilidades</h2>
        <div className="space-y-2">
          {abilities.map((ability) => (
            <div
              key={ability.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{ability.name}</p>
                {ability.minDamage !== null && ability.maxDamage !== null && (
                  <p className="text-xs text-muted-foreground">
                    {ability.minDamage} - {ability.maxDamage} de dano
                  </p>
                )}
              </div>
              {ability.type && (
                <Badge
                  className={`${damageTypeColors[ability.type]} text-white text-xs ml-2`}
                >
                  {damageTypeLabels[ability.type]}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}