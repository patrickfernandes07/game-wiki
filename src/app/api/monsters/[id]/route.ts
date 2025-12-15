import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { monsterFormSchema } from "@/lib/validations/monster";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const monster = await prisma.monster.findUnique({
      where: { id },
      include: {
        abilities: true,
        elementalResistances: true,
        loot: {
          include: {
            item: true,
          },
        },
        equipmentLoot: {
          include: {
            equipment: true,
          },
        },
      },
    });

    if (!monster) {
      return NextResponse.json(
        { error: "Monstro não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(monster);
  } catch (error) {
    console.error("Error fetching monster:", error);
    return NextResponse.json(
      { error: "Erro ao buscar monstro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = monsterFormSchema.parse(body);

    // Delete existing relations
    await prisma.monsterAbility.deleteMany({ where: { monsterId: id } });
    await prisma.elementalResistance.deleteMany({ where: { monsterId: id } });

    // Update monster with new data
    const monster = await prisma.monster.update({
      where: { id },
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

    return NextResponse.json(monster);
  } catch (error) {
    console.error("Error updating monster:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar monstro" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.monster.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting monster:", error);
    return NextResponse.json(
      { error: "Erro ao deletar monstro" },
      { status: 500 }
    );
  }
}
