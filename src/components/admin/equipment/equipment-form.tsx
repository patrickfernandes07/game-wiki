'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { equipmentFormSchema, type EquipmentFormData } from '@/lib/validations/equipment';
import { EquipmentType, EquipmentSlot } from '@prisma/client';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface EquipmentFormProps {
  initialData?: EquipmentFormData;
  equipmentId?: string;
}

const equipmentTypes = Object.values(EquipmentType);
const equipmentSlots = Object.values(EquipmentSlot);

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

const slotLabels: Record<EquipmentSlot, string> = {
  HEAD: 'Cabeça',
  ARMOR_SLOT: 'Corpo',
  LEGS_SLOT: 'Pernas',
  FEET: 'Pés',
  NECKLACE: 'Pescoço',
  RING_SLOT: 'Anel',
  LEFT_HAND: 'Mão Esquerda',
  RIGHT_HAND: 'Mão Direita',
  TWO_HANDED: 'Duas Mãos',
};

export function EquipmentForm({ initialData, equipmentId }: EquipmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: initialData || {
      equipment: {
        name: '',
        type: EquipmentType.WEAPON,
        slot: EquipmentSlot.RIGHT_HAND,
        level: 0,
        vocation: '',
        armor: null,
        attack: null,
        defense: null,
        range: null,
        weight: 0,
        imageUrl: '',
        description: '',
      },
      attributes: [],
      imbuements: {
        slots: 0,
      },
    },
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      setIsLoading(true);

      const url = equipmentId ? `/api/equipment/${equipmentId}` : '/api/equipment';
      const method = equipmentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar equipamento');
      }

      toast({
        title: 'Sucesso',
        description: equipmentId
          ? 'Equipamento atualizado com sucesso'
          : 'Equipamento criado com sucesso',
      });

      router.push('/admin/manage/equipment');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o equipamento',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="equipment.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Magic Sword" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="equipment.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {typeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slot *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slotLabels[slot]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (oz) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="35.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="equipment.vocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vocações</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Knights, Paladins"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Liste as vocações separadas por vírgula
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="equipment.armor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Armor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.attack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attack</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="48"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.defense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Defense</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="32"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment.range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="equipment.imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/sword.png"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Cole a URL completa da imagem do equipamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipment.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do equipamento..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Attributes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Atributos Especiais</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendAttribute({
                  attribute: '',
                  value: '',
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Atributo
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {attributeFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum atributo adicionado
              </p>
            ) : (
              attributeFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Atributo {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttribute(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`attributes.${index}.attribute`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Atributo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Fire Protection" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor *</FormLabel>
                          <FormControl>
                            <Input placeholder="+5%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Imbuements */}
        <Card>
          <CardHeader>
            <CardTitle>Imbuements</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="imbuements.slots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slots de Imbuement</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Número de slots disponíveis (0-3)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {equipmentId ? 'Atualizar' : 'Criar'} Equipamento
          </Button>
        </div>
      </form>
    </Form>
  );
}