"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (result?.error) {
      setErro("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
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
            Sistema de Gestão de Estudos Personalizado
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Entrar na conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google OAuth */}
            <Button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 flex items-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              Entrar com Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-500 text-xs">ou</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Credentials */}
            <form onSubmit={handleCredentials} className="space-y-4">
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
                  placeholder="••••••••"
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
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
              Não tem conta?{" "}
              <Link
                href="/cadastro"
                className="text-pink-500 hover:text-pink-400 underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
