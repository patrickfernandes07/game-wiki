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
  const hasNotifiedOneMinuteRef = useRef(false);
  const hasNotifiedTwoMinutesRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const initialSecondsRef = useRef<number>(timer.remainingSeconds);
  const scheduledTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Limpa todos os timeouts agendados
  const clearScheduledNotifications = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
  };

  // Agenda notificações baseadas no tempo real do sistema
  const scheduleNotifications = (remainingSeconds: number) => {
    clearScheduledNotifications();

    const now = Date.now();

    // Agenda notificação de 2 minutos
    if (remainingSeconds > 120 && !hasNotifiedTwoMinutesRef.current) {
      const twoMinDelay = (remainingSeconds - 120) * 1000;
      const timeout = setTimeout(() => {
        if (!hasNotifiedTwoMinutesRef.current && timer.isRunning) {
          hasNotifiedTwoMinutesRef.current = true;
          sendBrowserNotification(
            '⚠️ 2 Minutos Restantes',
            `${timer.name}: Fique atento ao tempo!`
          );
        }
      }, twoMinDelay);
      scheduledTimeoutsRef.current.push(timeout);
    }

    // Agenda notificação de 1 minuto
    if (remainingSeconds > 60 && !hasNotifiedOneMinuteRef.current) {
      const oneMinDelay = (remainingSeconds - 60) * 1000;
      const timeout = setTimeout(() => {
        if (!hasNotifiedOneMinuteRef.current && timer.isRunning) {
          hasNotifiedOneMinuteRef.current = true;
          sendBrowserNotification(
            '🔔 1 Minuto Restante!',
            `${timer.name}: Prepare-se para retirar o item!`
          );
        }
      }, oneMinDelay);
      scheduledTimeoutsRef.current.push(timeout);
    }

    // Agenda notificação de expiração
    if (remainingSeconds > 0 && !hasNotifiedRef.current) {
      const expireDelay = remainingSeconds * 1000;
      const timeout = setTimeout(() => {
        if (!hasNotifiedRef.current && timer.isRunning) {
          hasNotifiedRef.current = true;
          onUpdate(timer.id, { isRunning: false, remainingSeconds: 0 });
          playAlertSound();
          sendBrowserNotification(
            '⏰ Tempo Esgotado!',
            `${timer.name}: Retire o item agora para vender no NPC!`
          );
        }
      }, expireDelay);
      scheduledTimeoutsRef.current.push(timeout);
    }
  };

  // Sincroniza o estado local com as props quando necessário
  useEffect(() => {
    setLocalRemaining(timer.remainingSeconds);
    if (timer.isRunning && !timer.isPaused) {
      // Quando o timer está rodando, atualiza o timestamp de início
      startTimeRef.current = Date.now();
      initialSecondsRef.current = timer.remainingSeconds;

      // Agenda as notificações baseadas no tempo real
      scheduleNotifications(timer.remainingSeconds);
    } else {
      // Se pausou ou parou, cancela as notificações agendadas
      clearScheduledNotifications();
    }

    if (timer.remainingSeconds > 0) {
      hasNotifiedRef.current = false;
      hasNotifiedOneMinuteRef.current = false;
      hasNotifiedTwoMinutesRef.current = false;
    }

    // Cleanup ao desmontar
    return () => clearScheduledNotifications();
  }, [timer.remainingSeconds, timer.isRunning, timer.isPaused]);

  // Effect para o countdown baseado em tempo real
  useEffect(() => {
    if (!timer.isRunning || timer.isPaused) return;

    // Atualiza o timestamp de início quando o timer começa ou retoma
    startTimeRef.current = Date.now();
    initialSecondsRef.current = localRemaining;

    const updateTimer = () => {
      // Calcula quanto tempo realmente passou desde o início
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
      const newRemaining = Math.max(0, initialSecondsRef.current - elapsedSeconds);

      setLocalRemaining(newRemaining);

      // Atualiza o componente pai periodicamente (a cada 5 segundos ou quando chegar a 0)
      if (newRemaining === 0 || elapsedSeconds % 5 === 0) {
        onUpdate(timer.id, { remainingSeconds: newRemaining });
      }
    };

    const interval = setInterval(updateTimer, 1000);

    // Listener para quando a aba volta a ter foco
    const handleVisibilityChange = () => {
      if (!document.hidden && timer.isRunning && !timer.isPaused) {
        // Atualiza imediatamente quando a aba volta a ficar visível
        updateTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timer.isRunning, timer.isPaused, timer.id, onUpdate]);

  const sendBrowserNotification = (title: string, body: string) => {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: timer.id,
          requireInteraction: localRemaining === 0,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

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

  const handleReset = async () => {
    // Reseta o estado local imediatamente
    const resetSeconds = timer.durationMinutes * 60;
    setLocalRemaining(resetSeconds);

    // Reseta os refs de notificação
    hasNotifiedRef.current = false;
    hasNotifiedOneMinuteRef.current = false;
    hasNotifiedTwoMinutesRef.current = false;

    // Reseta o timer e inicia automaticamente
    onUpdate(timer.id, {
      remainingSeconds: resetSeconds,
      isRunning: true,
      isPaused: false,
    });

    // Pede permissão para notificações ao reiniciar
    await requestNotificationPermission();
  };

  const handleStart = async () => {
    // Pede permissão para notificações ao iniciar o timer
    await requestNotificationPermission();
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
