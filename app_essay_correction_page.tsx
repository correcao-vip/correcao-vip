// app/dashboard/essays/[id]/page.tsx
// ← AQUI É O PAINEL DE CORREÇÃO! Aqui você desenha e avalia!

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CanvasDrawer from '@/app/components/CanvasDrawer';
import CompetenciaSlider from '@/app/components/CompetenciaSlider';

interface Essay {
  id: string;
  student: {
    name: string;
    email: string;
    phone: string;
  };
  theme: {
    title: string;
    content: string;
  };
  contentType: 'TEXT' | 'IMG';
  contentText?: string;
  contentImgUrl?: string;
  submittedAt: string;
}

interface Correction {
  competencia1: number;
  competencia2: number;
  competencia3: number;
  competencia4: number;
  competencia5: number;
  generalComments: string;
  drawingUrl?: string;
}

export default function CorrectionPage() {
  const router = useRouter();
  const params = useParams();
  const essayId = params.id as string;

  const [essay, setEssay] = useState<Essay | null>(null);
  const [correction, setCorrection] = useState<Correction>({
    competencia1: 0,
    competencia2: 0,
    competencia3: 0,
    competencia4: 0,
    competencia5: 0,
    generalComments: '',
  });
  const [drawing, setDrawing] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEssay();
  }, [essayId]);

  const fetchEssay = async () => {
    try {
      const response = await fetch(`/api/essays/${essayId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar redação');

      const data = await response.json();
      setEssay(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar redação');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalNote = () => {
    const total =
      correction.competencia1 +
      correction.competencia2 +
      correction.competencia3 +
      correction.competencia4 +
      correction.competencia5;
    return Math.round(total / 5);
  };

  const handleSaveCorrection = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/corrections/${essayId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...correction,
          drawingUrl: drawing,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar correção');

      alert('✅ Correção salva com sucesso!');
      router.push('/dashboard/essays');
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao salvar correção');
    } finally {
      setSaving(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/essays/${essayId}/send-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          finalNote: calculateFinalNote(),
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar WhatsApp');

      alert('📱 WhatsApp enviado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar WhatsApp');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !essay) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando redação...</p>
        </div>
      </div>
    );
  }

  const finalNote = calculateFinalNote();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg border border-purple-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📝 Correção</h1>
              <div className="mt-2 space-y-1">
                <p className="text-lg font-medium text-gray-700">
                  Aluno: <span className="text-purple-600">{essay.student.name}</span>
                </p>
                <p className="text-gray-600">
                  Tema: {essay.theme.title}
                </p>
                <p className="text-sm text-gray-500">
                  Enviado em: {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Redação */}
          <div className="lg:col-span-2 space-y-6">
            {/* Redação/Imagem */}
            {essay.contentType === 'IMG' ? (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Redação (Imagem)</h3>
                {essay.contentImgUrl && (
                  <CanvasDrawer
                    imageUrl={essay.contentImgUrl}
                    onDrawingChange={setDrawing}
                    initialDrawing={drawing}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Redação (Texto)</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-96 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 leading-relaxed font-serif whitespace-pre-wrap">
                    {essay.contentText}
                  </p>
                </div>
              </div>
            )}

            {/* Comentários Gerais */}
            <div className="bg-white rounded-lg border border-purple-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Comentários Gerais</h3>
              <textarea
                value={correction.generalComments}
                onChange={(e) =>
                  setCorrection({
                    ...correction,
                    generalComments: e.target.value,
                  })
                }
                placeholder="Digite seus comentários aqui..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Coluna Direita - Avaliação */}
          <div className="lg:col-span-1 space-y-6">
            {/* Nota Final */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <div className="text-sm opacity-90 mb-1">Nota Final</div>
              <div className="text-5xl font-bold">{finalNote}</div>
              <div className="text-xs opacity-75 mt-2">Média das competências</div>
            </div>

            {/* Competências */}
            <div className="bg-white rounded-lg border border-purple-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Competências ENEM</h3>
              <div className="space-y-4">
                <CompetenciaSlider
                  label="Domínio da modalidade escrita"
                  value={correction.competencia1}
                  onChange={(value) =>
                    setCorrection({
                      ...correction,
                      competencia1: value,
                    })
                  }
                />
                <CompetenciaSlider
                  label="Compreensão da proposta"
                  value={correction.competencia2}
                  onChange={(value) =>
                    setCorrection({
                      ...correction,
                      competencia2: value,
                    })
                  }
                />
                <CompetenciaSlider
                  label="Seleção e organização"
                  value={correction.competencia3}
                  onChange={(value) =>
                    setCorrection({
                      ...correction,
                      competencia3: value,
                    })
                  }
                />
                <CompetenciaSlider
                  label="Mecanismos linguísticos"
                  value={correction.competencia4}
                  onChange={(value) =>
                    setCorrection({
                      ...correction,
                      competencia4: value,
                    })
                  }
                />
                <CompetenciaSlider
                  label="Proposta de intervenção"
                  value={correction.competencia5}
                  onChange={(value) =>
                    setCorrection({
                      ...correction,
                      competencia5: value,
                    })
                  }
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2">
              <button
                onClick={handleSaveCorrection}
                disabled={saving}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving ? '💾 Salvando...' : '💾 Salvar Correção'}
              </button>
              <button
                onClick={handleSendWhatsApp}
                disabled={saving}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? '📱 Enviando...' : '📱 Enviar WhatsApp'}
              </button>
              <button
                onClick={async () => {
                  // Gera PDF
                  const response = await fetch(`/api/corrections/${essayId}/pdf`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                  });
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Correcao_${essay.student.name}.pdf`;
                  a.click();
                }}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                📄 Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
