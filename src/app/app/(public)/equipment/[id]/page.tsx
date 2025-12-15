import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentStats } from '@/components/equipment/equipment-stats';
import { EquipmentAttributes } from '@/components/equipment/equipment-attributes';
import { EquipmentImbuements } from '@/components/equipment/equipment-imbuements';
import { ChevronLeft } from 'lucide-react';
import { EquipmentType } from '@prisma/client';

async function getEquipment(id: string) {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      attributes: {
        orderBy: {
          attribute: 'asc',
        },
      },
      imbuements: true,
    },
  });

  return equipment;
}

interface EquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
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

export default async function EquipmentPage({ params }: EquipmentPageProps) {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/equipment">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Equipamentos
          </Link>
        </Button>

        <div className="flex items-start gap-6">
          {equipment.imageUrl ? (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={equipment.imageUrl}
                alt={equipment.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">⚔️</span>
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {equipment.name}
              </h1>
              <Badge className={`${typeColors[equipment.type]} text-white`}>
                {typeLabels[equipment.type]}
              </Badge>
            </div>
            {equipment.description && (
              <p className="text-muted-foreground">{equipment.description}</p>
            )}
          </div>
        </div>
      </div>

      <EquipmentStats
        level={equipment.level}
        armor={equipment.armor}
        attack={equipment.attack}
        defense={equipment.defense}
        range={equipment.range}
        weight={equipment.weight}
        vocation={equipment.vocation}
      />

      <EquipmentAttributes attributes={equipment.attributes} />

      <EquipmentImbuements imbuements={equipment.imbuements} />
    </div>
  );
}

export async function generateMetadata({ params }: EquipmentPageProps) {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    return {
      title: 'Equipamento não encontrado',
    };
  }

  return {
    title: `${equipment.name} - Tibia Wiki`,
    description: equipment.description || `Informações sobre ${equipment.name}`,
  };
}