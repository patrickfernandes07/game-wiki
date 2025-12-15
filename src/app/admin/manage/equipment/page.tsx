import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EquipmentActions } from '@/components/admin/equipment/equipment-actions';
import { Plus } from 'lucide-react';
import { EquipmentType } from '@prisma/client';

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
      createdAt: true,
    },
  });

  return equipment;
}

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

export default async function AdminEquipmentPage() {
  const equipment = await getEquipment();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os equipamentos cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage/equipment/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Equipamento
          </Link>
        </Button>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum equipamento cadastrado ainda.
          </p>
          <Button asChild>
            <Link href="/admin/manage/equipment/new">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Equipamento
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{typeLabels[item.type]}</Badge>
                  </TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <EquipmentActions id={item.id} name={item.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}