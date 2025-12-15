import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function EquipmentEditNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Equipamento não encontrado</h2>
            <p className="text-muted-foreground">
              O equipamento que você está tentando editar não existe.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/manage/equipment">
              Voltar para lista de equipamentos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}