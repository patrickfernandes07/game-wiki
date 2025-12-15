import { ItemForm } from '@/components/admin/items/item-form';

export default function NewItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Item</h1>
        <p className="text-muted-foreground">
          Cadastre um novo item no sistema
        </p>
      </div>

      <ItemForm />
    </div>
  );
}