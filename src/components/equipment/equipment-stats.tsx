import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Sword, Weight, TrendingUp, Target } from 'lucide-react';

interface EquipmentStatsProps {
  level: number;
  armor: number | null;
  attack: number | null;
  defense: number | null;
  range: number | null;
  weight: number;
  vocation: string | null;
}

export function EquipmentStats({
  level,
  armor,
  attack,
  defense,
  range,
  weight,
  vocation,
}: EquipmentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {level > 0 && (
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg font-bold">{level}</p>
              </div>
            </div>
          )}

          {armor !== null && armor > 0 && (
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Armor</p>
                <p className="text-lg font-bold">{armor}</p>
              </div>
            </div>
          )}

          {attack !== null && attack > 0 && (
            <div className="flex items-center gap-3">
              <Sword className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Attack</p>
                <p className="text-lg font-bold">{attack}</p>
              </div>
            </div>
          )}

          {defense !== null && defense > 0 && (
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Defense</p>
                <p className="text-lg font-bold">{defense}</p>
              </div>
            </div>
          )}

          {range !== null && range > 0 && (
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Range</p>
                <p className="text-lg font-bold">{range}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Weight className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="text-lg font-bold">{weight} oz</p>
            </div>
          </div>
        </div>

        {vocation && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Vocações</p>
            <p className="font-medium">{vocation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}