import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EquipmentForm } from '@/components/admin/equipment/equipment-form';
import type { EquipmentFormData } from '@/lib/validations/equipment';

async function getEquipment(id: string) {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      attributes: true,
      imbuements: true,
    },
  });

  return equipment;
}

interface EditEquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { id } = await params;
  const equipment = await getEquipment(id);

  if (!equipment) {
    notFound();
  }

  // Transform data to match form schema
  const initialData: EquipmentFormData = {
    equipment: {
      name: equipment.name,
      type: equipment.type,
      slot: equipment.slot,
      level: equipment.level,
      vocation: equipment.vocation,
      armor: equipment.armor,
      attack: equipment.attack,
      defense: equipment.defense,
      range: equipment.range,
      weight: equipment.weight,
      imageUrl: equipment.imageUrl || '',
      description: equipment.description || '',
    },
    attributes: equipment.attributes.map((attr) => ({
      attribute: attr.attribute,
      value: attr.value,
    })),
    imbuements: {
      slots: equipment.imbuements[0]?.slots || 0,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Equipamento</h1>
        <p className="text-muted-foreground">
          Atualize as informações do equipamento {equipment.name}
        </p>
      </div>

      <EquipmentForm initialData={initialData} equipmentId={id} />
    </div>
  );
}