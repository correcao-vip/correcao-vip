// app/dashboard/page.tsx
// ← Esta é a página que aparece quando você faz login

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats {
  pendingEssays: number;
  finishedEssays: number;
  totalStudents: number;
  averageNote: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    pendingEssays: 0,
    finishedEssays: 0,
    totalStudents: 0,
    averageNote: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca dados do servidor
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              VIP
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Correção VIP</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Olá, Prof.ª Vivi! 👋</h2>
          <p className="text-gray-600 mt-2">Bem-vinda ao seu painel de correção</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Redações Pendentes */}
          <div className="bg-white rounded-lg border border-purple-200 p-6 hover:shadow-lg transition">
            <div className="text-sm font-semibold text-gray-600 uppercase">
              📝 Pendentes
            </div>
            <div className="text-4xl font-bold text-purple-600 mt-2">
              {stats.pendingEssays}
            </div>
            <p className="text-xs text-gray-500 mt-2">Aguardando sua correção</p>
            <Link
              href="/dashboard/essays"
              className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              Ver redações →
            </Link>
          </div>

          {/* Card 2: Redações Corrigidas */}
          <div className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-lg transition">
            <div className="text-sm font-semibold text-gray-600 uppercase">
              ✅ Corrigidas
            </div>
            <div className="text-4xl font-bold text-green-600 mt-2">
              {stats.finishedEssays}
            </div>
            <p className="text-xs text-gray-500 mt-2">Já avaliadas</p>
            <Link
              href="/dashboard/essays?status=FINISHED"
              className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700"
            >
              Ver histórico →
            </Link>
          </div>

          {/* Card 3: Total de Alunos */}
          <div className="bg-white rounded-lg border border-blue-200 p-6 hover:shadow-lg transition">
            <div className="text-sm font-semibold text-gray-600 uppercase">
              👥 Alunos
            </div>
            <div className="text-4xl font-bold text-blue-600 mt-2">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-gray-500 mt-2">Na sua base</p>
            <Link
              href="/dashboard/settings"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Gerenciar →
            </Link>
          </div>

          {/* Card 4: Nota Média */}
          <div className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition">
            <div className="text-sm font-semibold text-gray-600 uppercase">
              ⭐ Nota Média
            </div>
            <div className="text-4xl font-bold text-orange-600 mt-2">
              {stats.averageNote}
            </div>
            <p className="text-xs text-gray-500 mt-2">Das redações corrigidas</p>
            <Link
              href="/dashboard/reports"
              className="mt-4 inline-block text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Ver relatórios →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/essays"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition border border-purple-200"
            >
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-semibold text-gray-900">Corrigir Redação</div>
                <div className="text-xs text-gray-600">Avaliar trabalho do aluno</div>
              </div>
            </Link>

            <Link
              href="/dashboard/essays/upload"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition border border-blue-200"
            >
              <span className="text-2xl">⬆️</span>
              <div>
                <div className="font-semibold text-gray-900">Upload Redação</div>
                <div className="text-xs text-gray-600">Adicionar trabalho novo</div>
              </div>
            </Link>

            <Link
              href="/dashboard/reports"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg hover:shadow-md transition border border-green-200"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-gray-900">Relatórios</div>
                <div className="text-xs text-gray-600">Ver desempenho alunos</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recentes */}
        <div className="mt-8 bg-white rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Últimas Correções</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Nicole Passos</div>
                <div className="text-xs text-gray-600">Tema: A desigualdade social</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600">920</div>
                <div className="text-xs text-green-600">✓ Enviada</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Lavinia Cocho</div>
                <div className="text-xs text-gray-600">Tema: Desafios educacionais</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600">1000</div>
                <div className="text-xs text-green-600">✓ Enviada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
