"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, ZoomIn, Download, Loader2, RotateCcw, Move } from "lucide-react";

const MOCKUP_URL =
  "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/eu%20voto%20(1).png";

const OUTPUT_SIZE = 500;
const CROP_RATIO = 0.72; // área de corte é 72% do canvas visível no editor
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

type Natural = { w: number; h: number };
type Offset = { x: number; y: number };
type Step = "idle" | "editing" | "result";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function loadImage(src: string, crossOrigin?: "anonymous"): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.src = src;
  });
}

export default function EuVotoSim() {
  const [step, setStep] = useState<Step>("idle");
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [natural, setNatural] = useState<Natural | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState(320);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; startOffset: Offset }>({
    dragging: false,
    startX: 0,
    startY: 0,
    startOffset: { x: 0, y: 0 },
  });

  useEffect(() => {
    if (step !== "editing") return;
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageSize(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  useEffect(() => {
    return () => {
      if (photoSrc) URL.revokeObjectURL(photoSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A escala mínima (zoom=1) cobre apenas a caixa de corte, não o canvas inteiro —
  // isso permite zoom out adicional e muito mais liberdade de movimento.
  const cropSize = stageSize * CROP_RATIO;
  const scale = natural ? (cropSize / Math.min(natural.w, natural.h)) * zoom : 1;

  const clampOffset = useCallback(
    (raw: Offset, currentScale: number): Offset => {
      if (!natural) return { x: 0, y: 0 };
      const box = stageSize * CROP_RATIO;
      const scaledW = natural.w * currentScale;
      const scaledH = natural.h * currentScale;
      const maxX = Math.max(0, (scaledW - box) / 2);
      const maxY = Math.max(0, (scaledH - box) / 2);
      return { x: clamp(raw.x, -maxX, maxX), y: clamp(raw.y, -maxY, maxY) };
    },
    [natural, stageSize]
  );

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }
    setError("");
    if (photoSrc) URL.revokeObjectURL(photoSrc);
    const url = URL.createObjectURL(file);
    setPhotoSrc(url);
    setNatural(null);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setResultUrl(null);
    setStep("editing");
  }

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
  }

  function handleZoomChange(value: number) {
    setZoom(value);
    if (!natural) return;
    const newScale = (cropSize / Math.min(natural.w, natural.h)) * value;
    setOffset((prev) => clampOffset(prev, newScale));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!natural) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offset,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging || !natural) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const next = {
      x: dragState.current.startOffset.x + dx,
      y: dragState.current.startOffset.y + dy,
    };
    setOffset(clampOffset(next, scale));
  }

  function handlePointerUp() {
    dragState.current.dragging = false;
  }

  function handleWheel(e: React.WheelEvent) {
    if (!natural) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const next = clamp(zoom + delta, MIN_ZOOM, MAX_ZOOM);
    handleZoomChange(next);
  }

  function resetEditor() {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  async function handleConcluir() {
    if (!photoSrc || !natural) return;
    setProcessing(true);
    setError("");
    try {
      const [photoImg, mockupImg] = await Promise.all([
        loadImage(photoSrc),
        loadImage(MOCKUP_URL, "anonymous"),
      ]);

      const cropSize = stageSize * CROP_RATIO;
      const cropOffset = (stageSize - cropSize) / 2;
      const outputScale = OUTPUT_SIZE / cropSize;

      const scaledW = natural.w * scale;
      const scaledH = natural.h * scale;
      const imgTopLeftInStage = {
        x: stageSize / 2 - scaledW / 2 + offset.x,
        y: stageSize / 2 - scaledH / 2 + offset.y,
      };
      const imgTopLeftInCrop = {
        x: imgTopLeftInStage.x - cropOffset,
        y: imgTopLeftInStage.y - cropOffset,
      };

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Não foi possível processar a imagem.");

      ctx.drawImage(
        photoImg,
        imgTopLeftInCrop.x * outputScale,
        imgTopLeftInCrop.y * outputScale,
        scaledW * outputScale,
        scaledH * outputScale
      );
      ctx.drawImage(mockupImg, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const dataUrl = canvas.toDataURL("image/png");
      setResultUrl(dataUrl);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar a imagem.");
    } finally {
      setProcessing(false);
    }
  }

  function handleTrocarFoto() {
    setStep("idle");
    setResultUrl(null);
    setNatural(null);
    openFilePicker();
  }

  function closeModal() {
    setStep("idle");
  }

  const cropSizeCss = stageSize * CROP_RATIO;

  return (
    <main
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 45%, #111827 75%, #0a1628 100%)",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 45% at 8% 15%, rgba(255,107,0,0.20) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 40% at 92% 85%, rgba(255,107,0,0.15) 0%, transparent 65%)",
          ].join(", "),
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative z-10 container mx-auto px-6 py-14 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-4 py-1.5 text-accent-300 text-sm font-semibold mb-8 tracking-wide uppercase">
          Movimento NOVO Rumo
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          Diga <span className="text-accent-400">SIM</span>, você também, crie a sua foto de
          perfil de apoio a Simone Martini
        </h1>
        <p className="text-white/60 mb-10 text-base md:text-lg">
          Envie sua foto, ajuste como quiser e baixe sua imagem de perfil com a moldura oficial
          de apoio.
        </p>

        <div className="flex justify-center mb-10">
          <img
            src={MOCKUP_URL}
            alt="Exemplo da moldura Eu Voto Sim"
            className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl object-contain bg-white/5"
          />
        </div>

        {error && step === "idle" && (
          <p className="text-red-300 text-sm mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={openFilePicker}
          className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-white text-base shadow-xl hover:brightness-110 transition-all"
          style={{ background: "linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)" }}
        >
          <Upload size={20} />
          Anexar foto
        </button>

        <footer className="text-center pt-20 text-white/30 text-xs">
          Simone Martini · Partido NOVO Sarandi PR
        </footer>
      </div>

      {step === "editing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Ajuste sua foto</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4 flex items-start gap-2">
              <Move size={16} className="mt-0.5 shrink-0 text-accent-500" />
              Arraste a imagem para movê-la e use o controle de zoom para ajustar o
              enquadramento. A área escurecida não aparecerá na foto final.
            </p>

            <div
              ref={stageRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
              className="relative mx-auto w-full max-w-[380px] aspect-square rounded-2xl overflow-hidden bg-slate-200 select-none touch-none cursor-move"
            >
              {photoSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  onLoad={handleImgLoad}
                  alt="Sua foto"
                  draggable={false}
                  className="absolute top-1/2 left-1/2 max-w-none pointer-events-none"
                  style={
                    natural
                      ? {
                          width: natural.w * scale,
                          height: natural.h * scale,
                          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                        }
                      : { opacity: 0 }
                  }
                />
              )}

              {!natural && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-slate-400" />
                </div>
              )}

              {/* área escurecida fora do recorte */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  width: cropSizeCss,
                  height: cropSizeCss,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 9999px rgba(15,23,42,0.65)",
                  outline: "2px solid rgba(255,255,255,0.8)",
                  borderRadius: 12,
                }}
              />

              {/* mockup sobreposto à área de recorte */}
              <img
                src={MOCKUP_URL}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  width: cropSizeCss,
                  height: cropSizeCss,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <div className="flex items-center gap-3 mt-5">
              <ZoomIn size={18} className="text-slate-400 shrink-0" />
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-full accent-accent-500"
              />
              <button
                type="button"
                onClick={resetEditor}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                aria-label="Redefinir"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-3.5 font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConcluir}
                disabled={!natural || processing}
                className="flex-1 py-3.5 font-bold rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)" }}
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Concluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "result" && resultUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Sua foto está pronta!</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <img
              src={resultUrl}
              alt="Foto de perfil com moldura Eu Voto Sim"
              className="w-full max-w-[320px] mx-auto rounded-2xl shadow-xl mb-6"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleTrocarFoto}
                className="flex-1 py-3.5 font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Trocar foto
              </button>
              <a
                href={resultUrl}
                download="eu-voto-sim-simone-martini.png"
                className="flex-1 py-3.5 font-bold rounded-xl text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)" }}
              >
                <Download size={18} />
                Salvar imagem
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
