export interface TimerPreset {
  id: string;
  name: string;
  duration: number; // em minutos
  category: 'equipment' | 'ring' | 'amulet' | 'other';
  description?: string;
  imageUrl?: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  // Plasma Items (30 minutos)
  {
    id: 'collar-red-plasma',
    name: 'Collar of Red Plasma',
    duration: 30,
    category: 'amulet',
    description: 'Amulet que fornece +4 de axe, club e sword fighting',
  },
  {
    id: 'collar-blue-plasma',
    name: 'Collar of Blue Plasma',
    duration: 30,
    category: 'amulet',
    description: 'Amulet que fornece +4 de magic level',
  },
  {
    id: 'collar-green-plasma',
    name: 'Collar of Green Plasma',
    duration: 30,
    category: 'amulet',
    description: 'Amulet que fornece +4 de distance fighting e shielding',
  },
  {
    id: 'ring-red-plasma',
    name: 'Ring of Red Plasma',
    duration: 30,
    category: 'ring',
    description: 'Ring que fornece +4 de axe, club e sword fighting',
  },
  {
    id: 'ring-blue-plasma',
    name: 'Ring of Blue Plasma',
    duration: 30,
    category: 'ring',
    description: 'Ring que fornece +4 de magic level',
  },
  {
    id: 'ring-green-plasma',
    name: 'Ring of Green Plasma',
    duration: 30,
    category: 'ring',
    description: 'Ring que fornece +4 de distance fighting e shielding',
  },
  // Rings temporários
  {
    id: 'ring-healing',
    name: 'Ring of Healing',
    duration: 10,
    category: 'ring',
    description: 'Ring que regenera HP ao longo do tempo',
  },
  {
    id: 'stealth-ring',
    name: 'Stealth Ring',
    duration: 10,
    category: 'ring',
    description: 'Ring que torna o jogador invisível',
  },
  {
    id: 'soft-boots',
    name: 'Soft Boots',
    duration: 240,
    category: 'equipment',
    description: 'Botas que regeneram mana e HP (4 horas)',
  },
  {
    id: 'firewalker-boots',
    name: 'Firewalker Boots',
    duration: 600,
    category: 'equipment',
    description: 'Botas que protegem contra fogo (10 horas)',
  },
  // Runas e outros
  {
    id: 'magic-shield',
    name: 'Magic Shield',
    duration: 3,
    category: 'other',
    description: 'Duração do efeito de Magic Shield',
  },
  {
    id: 'haste',
    name: 'Haste',
    duration: 33,
    category: 'other',
    description: 'Duração do efeito de Haste',
  },
  {
    id: 'strong-haste',
    name: 'Strong Haste',
    duration: 22,
    category: 'other',
    description: 'Duração do efeito de Strong Haste',
  },
];

export const getPresetById = (id: string): TimerPreset | undefined => {
  return TIMER_PRESETS.find((preset) => preset.id === id);
};

export const getPresetsByCategory = (category: TimerPreset['category']): TimerPreset[] => {
  return TIMER_PRESETS.filter((preset) => preset.category === category);
};
