import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star } from 'lucide-react';

interface MonsterCardProps {
  id: string;
  name: string;
  hp: number;
  experience: number;
  imageUrl: string | null;
}

export function MonsterCard({
  id,
  name,
  hp,
  experience,
  imageUrl,
}: MonsterCardProps) {
  return (
    <Link href={`/monsters/${id}`}>
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
                <span className="text-2xl">👾</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="font-medium">{hp.toLocaleString('pt-BR')}</span>
            <span className="text-muted-foreground">HP</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">
              {experience.toLocaleString('pt-BR')}
            </span>
            <span className="text-muted-foreground">EXP</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}