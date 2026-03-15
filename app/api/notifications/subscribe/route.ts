import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Upsert: atualiza se já existe, cria se não existe
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PUSH] Erro ao salvar subscription:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint obrigatório" },
        { status: 400 },
      );
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: session.user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PUSH] Erro ao remover subscription:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
