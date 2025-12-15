import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { monsterFormSchema } from "@/lib/validations/monster";

export async function GET() {
  try {
    const monsters = await prisma.monster.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        hp: true,
        experience: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(monsters);
  } catch (error) {
    console.error("Error fetching monsters:", error);
    return NextResponse.json(
      { error: "Erro ao buscar monstros" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = monsterFormSchema.parse(body);

    const monster = await prisma.monster.create({
      data: {
        ...validatedData.monster,
        imageUrl: validatedData.monster.imageUrl || null,
        description: validatedData.monster.description || null,
        shielding: validatedData.monster.shielding || null,
        abilities: {
          create: validatedData.abilities.map((ability) => ({
            name: ability.name,
            minDamage: ability.minDamage || null,
            maxDamage: ability.maxDamage || null,
            type: ability.type || null,
          })),
        },
        elementalResistances: {
          create: validatedData.elementalResistances.map((resistance) => ({
            element: resistance.element,
            percent: resistance.percent,
          })),
        },
      },
      include: {
        abilities: true,
        elementalResistances: true,
      },
    });

    return NextResponse.json(monster, { status: 201 });
  } catch (error) {
    console.error("Error creating monster:", error);
    return NextResponse.json(
      { error: "Erro ao criar monstro" },
      { status: 500 }
    );
  }
}
