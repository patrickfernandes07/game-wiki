import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, TrendingUp } from 'lucide-react';
import { EquipmentType } from '@prisma/client';

interface EquipmentCardProps {
  id: string;
  name: string;
  type: EquipmentType;
  level: number;
  imageUrl: string | null;
  armor: number | null;
  attack: number | null;
  defense: number | null;
}

const typeColors: Record<EquipmentType, string> = {
  WEAPON: 'bg-red-500',
  ARMOR: 'bg-blue-500',
  SHIELD: 'bg-purple-500',
  HELMET: 'bg-cyan-500',
  LEGS: 'bg-green-500',
  BOOTS: 'bg-yellow-500',
  AMULET: 'bg-pink-500',
  RING: 'bg-orange-500',
};

const typeLabels: Record<EquipmentType, string> = {
  WEAPON: 'Arma',
  ARMOR: 'Armadura',
  SHIELD: 'Escudo',
  HELMET: 'Capacete',
  LEGS: 'Calças',
  BOOTS: 'Botas',
  AMULET: 'Amuleto',
  RING: 'Anel',
};

export function EquipmentCard({
  id,
  name,
  type,
  level,
  imageUrl,
  armor,
  attack,
  defense,
}: EquipmentCardProps) {
  return (
    <Link href={`/equipment/${id}`}>
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
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{name}</CardTitle>
              <Badge className={`${typeColors[type]} text-white mt-2`}>
                {typeLabels[type]}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {level > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Level {level}</span>
            </div>
          )}
          {armor !== null && armor > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{armor}</span>
              <span className="text-muted-foreground">Armor</span>
            </div>
          )}
          {attack !== null && attack > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Sword className="h-4 w-4 text-red-500" />
              <span className="font-medium">{attack}</span>
              <span className="text-muted-foreground">Attack</span>
            </div>
          )}
          {defense !== null && defense > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="font-medium">{defense}</span>
              <span className="text-muted-foreground">Defense</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}