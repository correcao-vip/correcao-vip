/**
 * CanvasDrawer Component
 * Permite desenhar em cima de imagem de redação com suporte a caneta de tablet
 * Persiste os desenhos e permite exportar como base64
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CanvasDrawerProps {
  imageUrl: string;
  onDrawingChange?: (drawingData: string) => void;
  initialDrawing?: string;
}

export default function CanvasDrawer({
  imageUrl,
  onDrawingChange,
  initialDrawing
}: CanvasDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lineColor, setLineColor] = useState('#FF0000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const img = imageRef.current;
    
    img.onload = () => {
      // Ajusta canvas ao tamanho da imagem
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Desenha a imagem no canvas
      ctx.drawImage(img, 0, 0);

      // Carrega desenho anterior se existir
      if (initialDrawing) {
        const previousCanvas = document.createElement('canvas');
        previousCanvas.width = img.width;
        previousCanvas.height = img.height;
        const prevCtx = previousCanvas.getContext('2d');
        if (prevCtx) {
          const previousImg = new Image();
          previousImg.onload = () => {
            prevCtx.drawImage(previousImg, 0, 0);
            ctx.drawImage(previousCanvas, 0, 0);
          };
          previousImg.src = initialDrawing;
        }
      }

      setContext(ctx);

      // Configurações de desenho
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = isEraser ? 0.2 : 1;
    };

    img.src = imageUrl;
  }, [imageUrl, initialDrawing, isEraser]);

  // Inicia desenho
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!context) return;

    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  // Desenha
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Suporte a pressão da caneta (tablet pen)
    const pressure = e.pressure || 1;
    const width = isEraser ? 20 : lineWidth + pressure * 8;

    context.lineWidth = width;
    context.strokeStyle = isEraser ? '#FFFFFF' : lineColor;
    context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    context.globalAlpha = isEraser ? 0.3 : 1;

    context.lineTo(x, y);
    context.stroke();

    // Notifica mudança
    if (canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL('image/png');
      onDrawingChange?.(drawingData);
    }
  };

  // Para de desenhar
  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  // Limpa o canvas
  const clearDrawing = () => {
    if (!context || !imageRef.current) return;

    context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    context.drawImage(imageRef.current, 0, 0);

    if (canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL('image/png');
      onDrawingChange?.(drawingData);
    }
  };

  // Desfaz último desenho
  const undoDrawing = () => {
    if (!context || !imageRef.current) return;

    // Recarrega imagem (simula desfazer)
    context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    context.drawImage(imageRef.current, 0, 0);

    // Para uma solução melhor, implementar stack de histórico
  };

  // Exporta desenho
  const exportDrawing = (): string => {
    return canvasRef.current?.toDataURL('image/png') || '';
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg border border-purple-200 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center pb-3 border-b border-purple-100">
        {/* Cores */}
        <div className="flex gap-2 items-center">
          <label className="text-xs font-semibold text-gray-600">Cor:</label>
          <div className="flex gap-2">
            {['#FF0000', '#000000', '#0066FF', '#00AA00', '#FFD700'].map((color) => (
              <button
                key={color}
                onClick={() => {
                  setLineColor(color);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  lineColor === color && !isEraser
                    ? 'border-purple-600 scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={`Cor ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Espessura */}
        <div className="flex gap-2 items-center">
          <label className="text-xs font-semibold text-gray-600">Espessura:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 h-2 bg-gray-200 rounded cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-4">{lineWidth}px</span>
        </div>

        {/* Borracha */}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
            isEraser
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🧹 Borracha
        </button>

        {/* Ações */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={undoDrawing}
            className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
          >
            ↶ Desfazer
          </button>
          <button
            onClick={clearDrawing}
            className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
          >
            🗑️ Limpar
          </button>
          <button
            onClick={() => {
              const drawing = exportDrawing();
              const link = document.createElement('a');
              link.href = drawing;
              link.download = 'anotacoes.png';
              link.click();
            }}
            className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all"
          >
            💾 Salvar
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center bg-gray-50 rounded border border-gray-200 overflow-auto max-h-[600px]">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="cursor-crosshair touch-none"
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>

      {/* Imagem oculta para referência */}
      <img ref={imageRef} className="hidden" alt="Redação do aluno" />

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        💡 Dica: Use caneta de tablet para melhor experiência. Pressão da caneta ajusta a espessura automaticamente.
      </p>
    </div>
  );
}

/**
 * Exemplo de uso:
 * 
 * const [drawing, setDrawing] = useState('');
 * 
 * <CanvasDrawer
 *   imageUrl="https://..."
 *   onDrawingChange={(data) => setDrawing(data)}
 *   initialDrawing={drawing}
 * />
 */
