import { enviarResumoSemanal } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Endpoint APENAS para testes em desenvolvimento
// Remover ou proteger antes de ir para produção

export async function GET() {
  try {
    // Busca o primeiro usuário cadastrado no banco
    const usuario = await prisma.user.findFirst({
      select: { id: true, email: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Nenhum usuário encontrado no banco." },
        { status: 404 },
      );
    }

    await enviarResumoSemanal(usuario.id);

    return NextResponse.json({
      ok: true,
      message: `E-mail enviado para ${usuario.email}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[TEST] Erro ao enviar e-mail de teste:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 },
    );
  }
}
