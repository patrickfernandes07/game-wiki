import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Zap, Shield, Check, X, Flame, Snowflake, Skull, Leaf, Sun } from 'lucide-react';
import { DamageType } from '@prisma/client';

interface ElementalResistance {
  id: string;
  element: DamageType;
  percent: number;
}

interface MonsterStatsProps {
  hp: number;
  experience: number;
  speed: number;
  armor: number;
  shielding: number | null;
  summonable: boolean;
  convinceable: boolean;
  illusionable: boolean;
  pushable: boolean;
  paralysable: boolean;
  elementalResistances: ElementalResistance[];
}

const damageTypeConfig: Record<DamageType, { color: string; bgColor: string; icon: React.ReactNode }> = {
  PHYSICAL: { 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100 border-gray-300',
    icon: <Shield className="h-4 w-4" />
  },
  FIRE: { 
    color: 'text-red-700', 
    bgColor: 'bg-red-100 border-red-300',
    icon: <Flame className="h-4 w-4" />
  },
  ICE: { 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100 border-blue-300',
    icon: <Snowflake className="h-4 w-4" />
  },
  ENERGY: { 
    color: 'text-purple-700', 
    bgColor: 'bg-purple-100 border-purple-300',
    icon: <Zap className="h-4 w-4" />
  },
  EARTH: { 
    color: 'text-green-700', 
    bgColor: 'bg-green-100 border-green-300',
    icon: <Leaf className="h-4 w-4" />
  },
  HOLY: { 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100 border-yellow-300',
    icon: <Sun className="h-4 w-4" />
  },
  DEATH: { 
    color: 'text-gray-900', 
    bgColor: 'bg-gray-200 border-gray-400',
    icon: <Skull className="h-4 w-4" />
  },
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

export function MonsterStats({
  hp,
  experience,
  speed,
  armor,
  shielding,
  summonable,
  convinceable,
  illusionable,
  pushable,
  paralysable,
  elementalResistances,
}: MonsterStatsProps) {
  const features = [
    { label: 'Summonable', value: summonable },
    { label: 'Convinceable', value: convinceable },
    { label: 'Illusionable', value: illusionable },
    { label: 'Pushable', value: pushable },
    { label: 'Paralysable', value: paralysable },
  ];

  // Função para determinar o estilo baseado na porcentagem
  const getResistanceStyle = (percent: number) => {
    if (percent === 0) {
      return 'bg-green-500 text-white'; // Imunidade
    } else if (percent < 100) {
      return 'bg-blue-500 text-white'; // Resistência
    } else if (percent === 100) {
      return 'bg-gray-400 text-white'; // Normal
    } else {
      return 'bg-red-500 text-white'; // Fraqueza
    }
  };

  const getResistanceLabel = (percent: number) => {
    if (percent === 0) return 'Imune';
    if (percent === 100) return '100%';
    return `${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Hit Points</p>
              <p className="text-lg font-bold">{hp.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-lg font-bold">
                {experience.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-lg font-bold">{speed}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Armor</p>
              <p className="text-lg font-bold">{armor}</p>
            </div>
          </div>

          {shielding !== null && (
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Shielding</p>
                <p className="text-lg font-bold">{shielding}</p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <h3 className="text-sm font-medium mb-3">Características</h3>
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
        </div>

        {/* Elemental Resistances */}
        {elementalResistances.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Resistências Elementais</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {elementalResistances.map((resistance) => {
                const config = damageTypeConfig[resistance.element];
                return (
                  <div
                    key={resistance.id}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 bg-card"
                  >
                    <div className={`${config.color}`}>
                      {config.icon}
                    </div>
                    <span className="text-xs font-medium text-center">
                      {damageTypeLabels[resistance.element]}
                    </span>
                    <Badge className={getResistanceStyle(resistance.percent)}>
                      {getResistanceLabel(resistance.percent)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}