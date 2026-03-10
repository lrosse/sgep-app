"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;
    const confirmarSenha = formData.get("confirmarSenha") as string;

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || "Erro ao criar conta.");
        setLoading(false);
        return;
      }

      // Login automático após cadastro
      const result = await signIn("credentials", {
        email,
        senha,
        redirect: false,
      });

      if (result?.error) {
        setErro("Conta criada! Faça login manualmente.");
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-white">
              SGEP<span className="text-pink-600">.</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">
            Crie sua conta e comece a estudar com inteligência
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Criar conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCadastro} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Nome</Label>
                <Input
                  name="nome"
                  type="text"
                  placeholder="Seu nome"
                  required
                  minLength={2}
                  maxLength={100}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">E-mail</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Senha</Label>
                <Input
                  name="senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Confirmar Senha</Label>
                <Input
                  name="confirmarSenha"
                  type="password"
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              {erro && (
                <p className="text-red-500 text-sm text-center">{erro}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>

              <p className="text-center text-sm text-zinc-500">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="text-pink-500 hover:text-pink-400 underline"
                >
                  Fazer login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
