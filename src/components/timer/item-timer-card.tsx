'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pause, Play, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimerData {
  id: string;
  name: string;
  durationMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  createdAt: number;
}

interface ItemTimerCardProps {
  timer: TimerData;
  onUpdate: (id: string, updates: Partial<TimerData>) => void;
  onDelete: (id: string) => void;
}

export function ItemTimerCard({ timer, onUpdate, onDelete }: ItemTimerCardProps) {
  const [localRemaining, setLocalRemaining] = useState(timer.remainingSeconds);
  const hasNotifiedRef = useRef(false);

  // Sincroniza o estado local com as props quando necessário
  useEffect(() => {
    setLocalRemaining(timer.remainingSeconds);
    if (timer.remainingSeconds > 0) {
      hasNotifiedRef.current = false;
    }
  }, [timer.remainingSeconds]);

  // Effect para o countdown
  useEffect(() => {
    if (!timer.isRunning || timer.isPaused) return;

    const interval = setInterval(() => {
      setLocalRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.isPaused]);

  // Effect separado para notificar o pai quando o tempo acabar
  useEffect(() => {
    if (localRemaining === 0 && timer.isRunning && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onUpdate(timer.id, { isRunning: false, remainingSeconds: 0 });
      playAlertSound();
    }
  }, [localRemaining, timer.isRunning, timer.id, onUpdate]);

  const playAlertSound = () => {
    // Tenta tocar um som de alerta (opcional)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        // Ignora erros se o som não estiver disponível
      });
    } catch {
      // Ignora erros
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = timer.durationMinutes * 60;
    return (localRemaining / totalSeconds) * 100;
  };

  const getAlertLevel = (): 'safe' | 'warning' | 'danger' | 'expired' => {
    const remaining = localRemaining;
    if (remaining === 0) return 'expired';
    if (remaining <= 60) return 'danger'; // Último minuto
    if (remaining <= 120) return 'warning'; // Últimos 2 minutos
    return 'safe';
  };

  const alertLevel = getAlertLevel();
  const progress = getProgressPercentage();

  const handleTogglePause = () => {
    onUpdate(timer.id, { isPaused: !timer.isPaused });
  };

  const handleReset = () => {
    onUpdate(timer.id, {
      remainingSeconds: timer.durationMinutes * 60,
      isRunning: false,
      isPaused: false,
    });
  };

  const handleStart = () => {
    onUpdate(timer.id, { isRunning: true, isPaused: false });
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300',
        alertLevel === 'expired' && 'border-red-500 bg-red-50 dark:bg-red-950/20',
        alertLevel === 'danger' && 'border-red-400 bg-red-50/50 dark:bg-red-950/10 animate-pulse',
        alertLevel === 'warning' && 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/10'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{timer.name}</CardTitle>
            <CardDescription>
              Duração total: {timer.durationMinutes} min
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(timer.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tempo restante */}
        <div className="text-center">
          <div
            className={cn(
              'text-4xl font-bold tabular-nums',
              alertLevel === 'expired' && 'text-red-600',
              alertLevel === 'danger' && 'text-red-500',
              alertLevel === 'warning' && 'text-yellow-600'
            )}
          >
            {formatTime(localRemaining)}
          </div>
          {alertLevel === 'expired' && (
            <p className="text-sm text-red-600 font-semibold mt-2">
              ⚠️ Tempo esgotado! Retire o item agora!
            </p>
          )}
          {alertLevel === 'danger' && (
            <p className="text-sm text-red-500 font-semibold mt-2">
              ⏰ Menos de 1 minuto restante!
            </p>
          )}
          {alertLevel === 'warning' && (
            <p className="text-sm text-yellow-600 font-semibold mt-2">
              ⚠️ Menos de 2 minutos restantes
            </p>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000 ease-linear',
              alertLevel === 'expired' && 'bg-red-600',
              alertLevel === 'danger' && 'bg-red-500',
              alertLevel === 'warning' && 'bg-yellow-500',
              alertLevel === 'safe' && 'bg-green-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          {!timer.isRunning ? (
            <Button onClick={handleStart} className="flex-1" size="sm">
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={handleTogglePause}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              {timer.isPaused ? (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Continuar
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pausar
                </>
              )}
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
