import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { equipmentFormSchema } from "@/lib/validations/equipment";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        attributes: true,
        imbuements: true,
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipamento" },
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
    const validatedData = equipmentFormSchema.parse(body);

    // Delete existing relations
    await prisma.equipmentAttribute.deleteMany({ where: { equipmentId: id } });
    await prisma.equipmentImbuement.deleteMany({ where: { equipmentId: id } });

    // Update equipment
    const equipment = await prisma.equipment.update({
      where: { id },
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

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar equipamento" },
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

    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json(
      { error: "Erro ao deletar equipamento" },
      { status: 500 }
    );
  }
}
