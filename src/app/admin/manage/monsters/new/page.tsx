import { MonsterForm } from '@/components/admin/monsters/monster-form';

export default function NewMonsterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Monstro</h1>
        <p className="text-muted-foreground">
          Cadastre um novo monstro no sistema
        </p>
      </div>

      <MonsterForm />
    </div>
  );
}