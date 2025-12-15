import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { equipmentFormSchema } from "@/lib/validations/equipment";

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        type: true,
        level: true,
        imageUrl: true,
        armor: true,
        attack: true,
        defense: true,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipamentos" },
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
    const validatedData = equipmentFormSchema.parse(body);

    const equipment = await prisma.equipment.create({
      data: {
        ...validatedData.equipment,
        imageUrl: validatedData.equipment.imageUrl || null,
        description: validatedData.equipment.description || null,
        vocation: validatedData.equipment.vocation || null,
        armor: validatedData.equipment.armor || null,
        attack: validatedData.equipment.attack || null,
        defense: validatedData.equipment.defense || null,
        range: validatedData.equipment.range || null,
        attributes: {
          create: validatedData.attributes,
        },
        imbuements: {
          create: validatedData.imbuements,
        },
      },
      include: {
        attributes: true,
        imbuements: true,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error("Error creating equipment:", error);
    return NextResponse.json(
      { error: "Erro ao criar equipamento" },
      { status: 500 }
    );
  }
}
