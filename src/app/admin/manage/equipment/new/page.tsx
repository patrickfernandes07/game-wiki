import { EquipmentForm } from '@/components/admin/equipment/equipment-form';

export default function NewEquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Equipamento</h1>
        <p className="text-muted-foreground">
          Cadastre um novo equipamento no sistema
        </p>
      </div>

      <EquipmentForm />
    </div>
  );
}