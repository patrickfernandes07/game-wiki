import { prisma } from '@/lib/prisma';
import { EquipmentTable } from '@/components/equipment/equipment-table';

async function getEquipment() {
  const equipment = await prisma.equipment.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      type: true,
      level: true,
      vocation: true,
      imageUrl: true,
      armor: true,
      attack: true,
      defense: true,
    },
  });

  return equipment;
}

export default async function EquipmentPage() {
  const equipment = await getEquipment();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
        <p className="text-muted-foreground">
          Explore armas, armaduras e acessórios do Tibia
        </p>
      </div>

      <EquipmentTable data={equipment} />
    </div>
  );
}