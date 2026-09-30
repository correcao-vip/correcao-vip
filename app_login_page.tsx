// app/(auth)/login/page.tsx
// ← Esta é a primeira página que aparece quando você entra no site

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chama API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        return;
      }

      // Salva token no localStorage
      localStorage.setItem('token', data.token);

      // Redireciona pra dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-white px-8">
        <div className="max-w-md">
          <div className="text-6xl font-bold mb-6">VIP</div>
          <h1 className="text-4xl font-bold mb-4">Correção VIP</h1>
          <p className="text-lg opacity-90">
            Plataforma inteligente para avaliar redações ENEM com desenho, comentários e WhatsApp integrado.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <div className="font-semibold">Desenhe na redação</div>
                <div className="text-sm opacity-75">Use sua caneta de tablet</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-semibold">Envie no WhatsApp</div>
                <div className="text-sm opacity-75">Notifique alunos automaticamente</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-semibold">Gere PDF</div>
                <div className="text-sm opacity-75">Com todas as anotações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Logo Mobile */}
            <div className="md:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto">
                VIP
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Bem-vinda!
            </h2>

            {/* Erro */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Botão Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-600">Primeira vez?</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Link Cadastro */}
            <Link
              href="/register"
              className="w-full py-2 border border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition text-center block"
            >
              Criar Conta
            </Link>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Plataforma Correção VIP • 2026
            </p>
          </div>

          {/* Demo */}
          <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg text-white text-center text-sm">
            <p className="font-semibold">🔐 Demo (teste):</p>
            <p>Email: vivi@correcaovip.com</p>
            <p>Senha: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
