import Link from 'next/link';
import { Sword, Shield, Package, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Bem-vindo ao Tibia Wiki
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Sua fonte completa de informações sobre monstros, equipamentos, itens
          e ferramentas úteis para o jogo Tibia.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/monsters">
              <Sword className="mr-2 h-5 w-5" />
              Explorar Monstros
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tools/imbuement">
              <Sparkles className="mr-2 h-5 w-5" />
              Calculadoras
            </Link>
          </Button>
        </div>
      </section>

      {/* Cyclopedia Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Cyclopedia</h2>
          <p className="text-muted-foreground">
            Explore informações detalhadas sobre o mundo de Tibia
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/monsters">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Sword className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Monstros</CardTitle>
                <CardDescription>
                  Informações completas sobre criaturas, habilidades, fraquezas
                  e loot
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/equipment">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Equipamentos</CardTitle>
                <CardDescription>
                  Armas, armaduras, escudos e acessórios com stats completos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/items">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Package className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Itens</CardTitle>
                <CardDescription>
                  Poções, runas, comidas e itens valiosos do jogo
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Utilitários</h2>
          <p className="text-muted-foreground">
            Ferramentas úteis para otimizar sua experiência no jogo
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/tools/imbuement">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Sparkles className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Calculadora de Imbuement</CardTitle>
                <CardDescription>
                  Calcule os materiais necessários para seus imbuements
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tools/timer">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Clock className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Cronômetro de Equipamentos</CardTitle>
                <CardDescription>
                  Gerencie o tempo de duração dos seus equipamentos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}