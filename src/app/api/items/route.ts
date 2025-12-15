import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { itemSchema } from "@/lib/validations/item";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        stackable: true,
        weight: true,
        buyPrice: true,
        sellPrice: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
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
    const validatedData = itemSchema.parse(body);

    const item = await prisma.item.create({
      data: {
        ...validatedData,
        imageUrl: validatedData.imageUrl || null,
        description: validatedData.description || null,
        buyPrice: validatedData.buyPrice || null,
        sellPrice: validatedData.sellPrice || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Erro ao criar item" }, { status: 500 });
  }
}
