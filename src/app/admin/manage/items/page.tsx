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
import { ItemActions } from '@/components/admin/items/item-actions';
import { Plus } from 'lucide-react';
import { ItemCategory } from '@prisma/client';

async function getItems() {
  const items = await prisma.item.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      category: true,
      weight: true,
      createdAt: true,
    },
  });

  return items;
}

const categoryLabels: Record<ItemCategory, string> = {
  RUNE: 'Runa',
  POTION: 'Poção',
  FOOD: 'Comida',
  TOOL: 'Ferramenta',
  VALUABLE: 'Valioso',
  CONTAINER: 'Contêiner',
  OTHER: 'Outro',
};

export default async function AdminItemsPage() {
  const items = await getItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Itens</h1>
          <p className="text-muted-foreground">
            Gerencie os itens cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage/items/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum item cadastrado ainda.
          </p>
          <Button asChild>
            <Link href="/admin/manage/items/new">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Item
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabels[item.category]}</Badge>
                  </TableCell>
                  <TableCell>{item.weight} oz</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <ItemActions id={item.id} name={item.name} />
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