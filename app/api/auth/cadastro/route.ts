import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json();

    // Validações
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { erro: "Todos os campos são obrigatórios." },
        { status: 400 },
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { erro: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 },
      );
    }

    // Verifica se e-mail já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { erro: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Cria o usuário
    await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });

    return NextResponse.json({ sucesso: true }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
