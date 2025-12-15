'use client';

import { useEffect, useState } from 'react';
import { ItemTimerCard, type TimerData } from '@/components/timer/item-timer-card';
import { AddTimerDialog } from '@/components/timer/add-timer-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const STORAGE_KEY = 'tibia-wiki-timers';

export default function TimerPage() {
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carrega timers do localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTimers: TimerData[] = JSON.parse(stored);

        // Atualiza o tempo restante baseado no tempo que passou
        const now = Date.now();
        const updatedTimers = parsedTimers
          .map((timer) => {
            if (!timer.isRunning || timer.isPaused) return timer;

            const elapsedSeconds = Math.floor((now - timer.createdAt) / 1000);
            const newRemaining = Math.max(0, timer.remainingSeconds - elapsedSeconds);

            return {
              ...timer,
              remainingSeconds: newRemaining,
              isRunning: newRemaining > 0,
              createdAt: now,
            };
          })
          .filter((timer) => timer.remainingSeconds > 0 || !timer.isRunning);

        setTimers(updatedTimers);
      }
    } catch (error) {
      console.error('Erro ao carregar timers:', error);
    }
  }, []);

  // Salva timers no localStorage sempre que mudar
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error('Erro ao salvar timers:', error);
    }
  }, [timers, mounted]);

  const handleAddTimer = (name: string, durationMinutes: number) => {
    const newTimer: TimerData = {
      id: Date.now().toString(),
      name,
      durationMinutes,
      remainingSeconds: durationMinutes * 60,
      isRunning: false,
      isPaused: false,
      createdAt: Date.now(),
    };

    setTimers((prev) => [...prev, newTimer]);
  };

  const handleUpdateTimer = (id: string, updates: Partial<TimerData>) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, ...updates, createdAt: Date.now() }
          : timer
      )
    );
  };

  const handleDeleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const handleClearAll = () => {
    setTimers([]);
  };

  const activeTimersCount = timers.filter((t) => t.isRunning && !t.isPaused).length;

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cronômetro de Itens</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie seus itens temporários do Tibia. Receba alertas antes que expirem!
        </p>
      </div>

      {/* Stats */}
      {timers.length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total de Timers</p>
              <p className="text-2xl font-bold">{timers.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeTimersCount}</p>
            </div>
          </div>
          {timers.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover todos os timers? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      {/* Botão de adicionar */}
      <div className="mb-6 flex justify-center">
        <AddTimerDialog onAdd={handleAddTimer} />
      </div>

      {/* Lista de timers */}
      {timers.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum timer ativo</h3>
          <p className="text-muted-foreground mb-6">
            Adicione um timer para começar a gerenciar seus itens temporários
          </p>
          <AddTimerDialog onAdd={handleAddTimer} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timers.map((timer) => (
            <ItemTimerCard
              key={timer.id}
              timer={timer}
              onUpdate={handleUpdateTimer}
              onDelete={handleDeleteTimer}
            />
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span>💡</span>
          Dicas de uso
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • <strong>Collar of Red Plasma:</strong> Retire nos últimos 60 segundos para vender no NPC
          </li>
          <li>
            • <strong>Alertas:</strong> Você receberá avisos visuais quando faltar 2 minutos e 1 minuto
          </li>
          <li>
            • <strong>Persistência:</strong> Seus timers são salvos automaticamente no navegador
          </li>
          <li>
            • <strong>Múltiplos timers:</strong> Gerencie vários itens simultaneamente
          </li>
        </ul>
      </div>
    </div>
  );
}
