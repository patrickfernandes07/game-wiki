'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationBanner() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);

      // Mostra o banner se ainda não tiver permissão
      if (Notification.permission === 'default') {
        setShowBanner(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações');
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      setShowBanner(false);
      sendTestNotification();
    }
  };

  const sendTestNotification = () => {
    try {
      console.log('Enviando notificação de teste...');
      const notification = new Notification('🎉 Notificações Ativadas!', {
        body: 'Você receberá alertas quando seus timers estiverem expirando.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false,
      });

      notification.onclick = () => {
        console.log('Notificação clicada!');
        window.focus();
        notification.close();
      };

      notification.onerror = (error) => {
        console.error('Erro na notificação:', error);
      };

      notification.onshow = () => {
        console.log('Notificação exibida com sucesso!');
      };

      notification.onclose = () => {
        console.log('Notificação fechada');
      };

      console.log('Notificação de teste criada com sucesso');
    } catch (error) {
      console.error('Erro ao criar notificação de teste:', error);
      alert('Erro ao criar notificação: ' + error);
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  // Banner de solicitação de permissão
  if (showBanner && permission === 'default') {
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Ative as Notificações
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Receba alertas no seu PC quando faltar 2 minutos, 1 minuto e quando o item expirar!
            </p>
            <div className="flex gap-2">
              <Button onClick={requestPermission} size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Ativar Notificações
              </Button>
              <Button
                onClick={() => setShowBanner(false)}
                variant="ghost"
                size="sm"
              >
                Agora não
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Indicador de status das notificações
  return (
    <div
      className={cn(
        'mb-6 p-3 rounded-lg border flex items-center gap-3',
        permission === 'granted' && 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
        permission === 'denied' && 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      )}
    >
      {permission === 'granted' ? (
        <>
          <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Notificações ativadas
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Você receberá alertas quando os timers estiverem expirando
            </p>
          </div>
          <Button
            onClick={sendTestNotification}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-gray-900"
          >
            Testar Notificação
          </Button>
        </>
      ) : permission === 'denied' ? (
        <>
          <BellOff className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              Notificações bloqueadas
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Habilite nas configurações do navegador para receber alertas
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
