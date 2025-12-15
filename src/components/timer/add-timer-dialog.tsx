'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { TIMER_PRESETS, type TimerPreset } from '@/lib/timer-presets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AddTimerDialogProps {
  onAdd: (name: string, durationMinutes: number) => void;
}

export function AddTimerDialog({ onAdd }: AddTimerDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customDuration, setCustomDuration] = useState('');

  const handleAddPreset = () => {
    const preset = TIMER_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset) return;

    onAdd(preset.name, preset.duration);
    setOpen(false);
    setSelectedPreset('');
  };

  const handleAddCustom = () => {
    if (!customName.trim() || !customDuration) return;

    const duration = parseInt(customDuration);
    if (isNaN(duration) || duration <= 0) return;

    onAdd(customName.trim(), duration);
    setOpen(false);
    setCustomName('');
    setCustomDuration('');
  };

  const categorizedPresets = TIMER_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = [];
      }
      acc[preset.category].push(preset);
      return acc;
    },
    {} as Record<string, TimerPreset[]>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Timer</DialogTitle>
          <DialogDescription>
            Escolha um item pré-definido ou crie um timer personalizado
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Itens Pré-definidos</TabsTrigger>
            <TabsTrigger value="custom">Timer Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset">Selecione um item</Label>
              <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger id="preset">
                  <SelectValue placeholder="Escolha um item..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categorizedPresets).map(([category, presets]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        {category === 'equipment' && '⚔️ Equipamentos'}
                        {category === 'ring' && '💍 Anéis'}
                        {category === 'amulet' && '📿 Amuletos'}
                        {category === 'other' && '✨ Outros'}
                      </div>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name} ({preset.duration} min)
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPreset && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {TIMER_PRESETS.find((p) => p.id === selectedPreset)?.description}
                </p>
              </div>
            )}

            <Button onClick={handleAddPreset} disabled={!selectedPreset} className="w-full">
              Adicionar Timer
            </Button>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-name">Nome do Item</Label>
              <Input
                id="custom-name"
                placeholder="Ex: Prismatic Ring"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-duration">Duração (minutos)</Label>
              <Input
                id="custom-duration"
                type="number"
                min="1"
                placeholder="Ex: 30"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddCustom}
              disabled={!customName.trim() || !customDuration}
              className="w-full"
            >
              Criar Timer Personalizado
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
