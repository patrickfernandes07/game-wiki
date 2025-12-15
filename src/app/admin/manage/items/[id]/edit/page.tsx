import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ItemForm } from '@/components/admin/items/item-form';
import type { ItemFormData } from '@/lib/validations/item';

async function getItem(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
  });

  return item;
}

interface EditItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  // Transform data to match form schema
  const initialData: ItemFormData = {
    name: item.name,
    category: item.category,
    stackable: item.stackable,
    weight: item.weight,
    buyPrice: item.buyPrice,
    sellPrice: item.sellPrice,
    imageUrl: item.imageUrl || '',
    description: item.description || '',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Item</h1>
        <p className="text-muted-foreground">
          Atualize as informações do item {item.name}
        </p>
      </div>

      <ItemForm initialData={initialData} itemId={id} />
    </div>
  );
}