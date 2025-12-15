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
import { MonsterActions } from '@/components/admin/monsters/monster-actions';
import { Plus } from 'lucide-react';

async function getMonsters() {
  const monsters = await prisma.monster.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      hp: true,
      experience: true,
      createdAt: true,
    },
  });

  return monsters;
}

export default async function AdminMonstersPage() {
  const monsters = await getMonsters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monstros</h1>
          <p className="text-muted-foreground">
            Gerencie os monstros cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage/monsters/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Monstro
          </Link>
        </Button>
      </div>

      {monsters.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum monstro cadastrado ainda.
          </p>
          <Button asChild>
            <Link href="/admin/manage/monsters/new">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Primeiro Monstro
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>HP</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monsters.map((monster) => (
                <TableRow key={monster.id}>
                  <TableCell className="font-medium">{monster.name}</TableCell>
                  <TableCell>{monster.hp.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    {monster.experience.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(monster.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <MonsterActions id={monster.id} name={monster.name} />
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