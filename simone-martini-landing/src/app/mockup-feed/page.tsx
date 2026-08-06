"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  X,
  ZoomIn,
  Download,
  Loader2,
  RotateCcw,
  Move,
  ArrowRight,
  Check,
  Images,
  Type,
} from "lucide-react";

const MOCKUP_CAPA_URL =
  "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/Mockup%20Feed%20Simone.png";
const MOCKUP_FEED_URL =
  "https://ucezjskktvkhkmtqzdyc.supabase.co/storage/v1/object/public/Arquivos/Imagens/Mockup%20Carrossel%20Simone.png";

// Os dois mockups têm 1080x1350: topo transparente (mostra a foto), depois um
// degradê para branco e, por fim, a moldura opaca (barras + logo). A foto cobre
// o canvas inteiro para que esse degradê se misture nela, e não num fundo vazio.
const OUTPUT_W = 1080;
const OUTPUT_H = 1350;
const STAGE_ASPECT = OUTPUT_H / OUTPUT_W;

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

// Centro do retângulo azul e do retângulo laranja no mockup de capa (em px do
// canvas final 1080x1350), usados como posição inicial do título e subtítulo.
const TITLE_CENTER = { x: 537, y: 867 };
const SUBTITLE_CENTER = { x: 537, y: 1012 };
const TITLE_SIZE_RANGE = { min: 28, max: 160, default: 60 };
const SUBTITLE_SIZE_RANGE = { min: 20, max: 120, default: 40 };

type Natural = { w: number; h: number };
type Offset = { x: number; y: number };
type Stage = "idle" | "chooseCover" | "editing" | "results";
type PhotoItem = { file: File; url: string };
type ResultItem = { kind: "capa" | "feed"; url: string; label: string };
type TextLayer = { text: string; size: number; pos: Offset };
type DragTarget = "photo" | "title" | "subtitle";

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

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  fontFamily: string
) {
  if (!text.trim()) return;
  ctx.save();
  ctx.font = `700 ${size}px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const touch = navigator.maxTouchPoints > 0;
  const mobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return touch && mobileUA;
}

function downloadFiles(files: File[], fallbackName: string) {
  files.forEach((file, i) => {
    const blobUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = files.length === 1 ? fallbackName : file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
  });
}

// No celular usamos o share sheet nativo (permite "Salvar imagem" direto na
// galeria de fotos). No desktop isso abriria o painel de compartilhamento do
// SO, então lá sempre baixamos o arquivo direto.
async function saveFiles(files: File[], shareTitle: string, fallbackName: string) {
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (isMobileDevice() && nav.share && nav.canShare?.({ files })) {
    try {
      await nav.share({ files, title: shareTitle });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  downloadFiles(files, fallbackName);
}

export default function MockupFeed() {
  const [stage, setStage] = useState<Stage>("idle");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [queue, setQueue] = useState<number[]>([]); // índices em `photos`; queue[0] é sempre a capa
  const [queuePos, setQueuePos] = useState(0);
  const [results, setResults] = useState<ResultItem[]>([]);

  const [natural, setNatural] = useState<Natural | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [stageWidth, setStageWidth] = useState(320);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState<TextLayer>({
    text: "",
    size: TITLE_SIZE_RANGE.default,
    pos: { x: 0, y: 0 },
  });
  const [subtitle, setSubtitle] = useState<TextLayer>({
    text: "",
    size: SUBTITLE_SIZE_RANGE.default,
    pos: { x: 0, y: 0 },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ target: DragTarget | null; startX: number; startY: number; startOffset: Offset }>({
    target: null,
    startX: 0,
    startY: 0,
    startOffset: { x: 0, y: 0 },
  });

  const isCoverStep = queuePos === 0;
  const currentPhoto = stage === "editing" ? photos[queue[queuePos]] : null;
  const mockupUrl = isCoverStep ? MOCKUP_CAPA_URL : MOCKUP_FEED_URL;

  useEffect(() => {
    if (stage !== "editing") return;
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage]);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const box = useMemo(() => ({ w: stageWidth, h: stageWidth * STAGE_ASPECT }), [stageWidth]);
  const displayScale = box.w > 0 ? box.w / OUTPUT_W : 0;
  const scale = natural ? Math.max(box.w / natural.w, box.h / natural.h) * zoom : 1;

  const clampOffset = useCallback(
    (raw: Offset, currentScale: number): Offset => {
      if (!natural) return { x: 0, y: 0 };
      const scaledW = natural.w * currentScale;
      const scaledH = natural.h * currentScale;
      const maxX = Math.max(0, (scaledW - box.w) / 2);
      const maxY = Math.max(0, (scaledH - box.h) / 2);
      return { x: clamp(raw.x, -maxX, maxX), y: clamp(raw.y, -maxY, maxY) };
    },
    [natural, box]
  );

  function clampTextPos(center: Offset, raw: Offset): Offset {
    return {
      x: clamp(raw.x, -center.x, OUTPUT_W - center.x),
      y: clamp(raw.y, -center.y, OUTPUT_H - center.y),
    };
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (list.length === 0) return;

    const images = list.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setError("Selecione arquivos de imagem válidos.");
      return;
    }

    setError("");
    const items = images.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos(items);
    setResults([]);

    if (items.length === 1) {
      setQueue([0]);
      startEditing(0);
    } else {
      setStage("chooseCover");
    }
  }

  function chooseCover(index: number) {
    const rest = photos.map((_, i) => i).filter((i) => i !== index);
    setQueue([index, ...rest]);
    startEditing(0);
  }

  function startEditing(pos: number) {
    setQueuePos(pos);
    setNatural(null);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setError("");
    setStage("editing");
  }

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
  }

  function handleZoomChange(value: number) {
    setZoom(value);
    if (!natural) return;
    const newScale = Math.max(box.w / natural.w, box.h / natural.h) * value;
    setOffset((prev) => clampOffset(prev, newScale));
  }

  function handleStagePointerDown(e: React.PointerEvent) {
    if (!natural) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragState.current = { target: "photo", startX: e.clientX, startY: e.clientY, startOffset: offset };
  }

  function handleTextPointerDown(target: "title" | "subtitle") {
    return (e: React.PointerEvent) => {
      e.stopPropagation();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      dragState.current = {
        target,
        startX: e.clientX,
        startY: e.clientY,
        startOffset: target === "title" ? title.pos : subtitle.pos,
      };
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragState.current;
    if (!drag.target) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.target === "photo") {
      if (!natural) return;
      const next = { x: drag.startOffset.x + dx, y: drag.startOffset.y + dy };
      setOffset(clampOffset(next, scale));
      return;
    }

    if (!displayScale) return;
    const raw = { x: drag.startOffset.x + dx / displayScale, y: drag.startOffset.y + dy / displayScale };
    if (drag.target === "title") {
      setTitle((t) => ({ ...t, pos: clampTextPos(TITLE_CENTER, raw) }));
    } else {
      setSubtitle((t) => ({ ...t, pos: clampTextPos(SUBTITLE_CENTER, raw) }));
    }
  }

  function handlePointerUp() {
    dragState.current.target = null;
  }

  function handleWheel(e: React.WheelEvent) {
    if (!natural) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    handleZoomChange(clamp(zoom + delta, MIN_ZOOM, MAX_ZOOM));
  }

  function resetEditor() {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  async function handleAvancar() {
    if (!currentPhoto || !natural) return;
    setProcessing(true);
    setError("");
    try {
      const [photoImg, mockupImg] = await Promise.all([
        loadImage(currentPhoto.url),
        loadImage(mockupUrl, "anonymous"),
      ]);

      const outputScale = OUTPUT_W / box.w;
      const scaledW = natural.w * scale;
      const scaledH = natural.h * scale;
      const topLeft = {
        x: box.w / 2 - scaledW / 2 + offset.x,
        y: box.h / 2 - scaledH / 2 + offset.y,
      };

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_W;
      canvas.height = OUTPUT_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Não foi possível processar a imagem.");

      ctx.drawImage(
        photoImg,
        topLeft.x * outputScale,
        topLeft.y * outputScale,
        scaledW * outputScale,
        scaledH * outputScale
      );
      ctx.drawImage(mockupImg, 0, 0, OUTPUT_W, OUTPUT_H);

      if (isCoverStep) {
        await document.fonts.ready;
        const fontFamily = getComputedStyle(document.body).fontFamily;
        drawCenteredText(
          ctx,
          title.text,
          TITLE_CENTER.x + title.pos.x,
          TITLE_CENTER.y + title.pos.y,
          title.size,
          fontFamily
        );
        drawCenteredText(
          ctx,
          subtitle.text,
          SUBTITLE_CENTER.x + subtitle.pos.x,
          SUBTITLE_CENTER.y + subtitle.pos.y,
          subtitle.size,
          fontFamily
        );
      }

      const dataUrl = canvas.toDataURL("image/png");
      const feedNumber = queuePos; // 1, 2, 3... (posição 0 é a capa)
      const newResult: ResultItem = isCoverStep
        ? { kind: "capa", url: dataUrl, label: "Capa" }
        : { kind: "feed", url: dataUrl, label: `Foto ${feedNumber}` };

      const nextResults = [...results, newResult];
      setResults(nextResults);

      if (queuePos + 1 < queue.length) {
        startEditing(queuePos + 1);
      } else {
        setStage("results");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar a imagem.");
    } finally {
      setProcessing(false);
    }
  }

  async function dataUrlToFile(dataUrl: string, name: string) {
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], name, { type: "image/png" });
  }

  async function handleSalvarUma(item: ResultItem, index: number) {
    setSaving(true);
    setSaveError("");
    try {
      const name =
        item.kind === "capa"
          ? "capa-simone-martini.png"
          : `feed-${index}-simone-martini.png`;
      const file = await dataUrlToFile(item.url, name);
      await saveFiles([file], "Feed - Simone Martini", name);
    } catch {
      window.open(item.url, "_blank");
      setSaveError("Toque e segure na imagem que abriu para salvá-la na galeria.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSalvarTodas() {
    setSaving(true);
    setSaveError("");
    try {
      const files = await Promise.all(
        results.map((item, i) =>
          dataUrlToFile(
            item.url,
            item.kind === "capa" ? "capa-simone-martini.png" : `feed-${i}-simone-martini.png`
          )
        )
      );
      await saveFiles(files, "Feed - Simone Martini", "feed-simone-martini.png");
    } catch {
      setSaveError("Não foi possível baixar todas de uma vez. Baixe uma por uma abaixo.");
    } finally {
      setSaving(false);
    }
  }

  function resetAll() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setQueue([]);
    setQueuePos(0);
    setResults([]);
    setSaveError("");
    setError("");
    setTitle({ text: "", size: TITLE_SIZE_RANGE.default, pos: { x: 0, y: 0 } });
    setSubtitle({ text: "", size: SUBTITLE_SIZE_RANGE.default, pos: { x: 0, y: 0 } });
    setStage("idle");
  }

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
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative z-10 container mx-auto px-6 py-14 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-4 py-1.5 text-accent-300 text-sm font-semibold mb-8 tracking-wide uppercase">
          Movimento NOVO Rumo
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          Monte seu <span className="text-accent-400">carrossel</span> de apoio a Simone Martini
        </h1>
        <p className="text-white/60 mb-10 text-base md:text-lg">
          Envie suas fotos, escolha a capa, ajuste o enquadramento e baixe seu feed pronto com a
          moldura oficial de apoio.
        </p>

        <div className="flex justify-center gap-4 mb-10">
          <img
            src={MOCKUP_CAPA_URL}
            alt="Exemplo do mockup de capa"
            className="w-32 md:w-40 aspect-[1080/1350] rounded-2xl shadow-2xl object-contain bg-white/5"
          />
          <img
            src={MOCKUP_FEED_URL}
            alt="Exemplo do mockup das demais fotos"
            className="w-32 md:w-40 aspect-[1080/1350] rounded-2xl shadow-2xl object-contain bg-white/5"
          />
        </div>

        {error && stage === "idle" && <p className="text-red-300 text-sm mb-4">{error}</p>}

        <button
          type="button"
          onClick={openFilePicker}
          className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-white text-base shadow-xl hover:brightness-110 transition-all"
          style={{ background: "linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)" }}
        >
          <Upload size={20} />
          Adicionar fotos
        </button>

        <footer className="text-center pt-20 text-white/30 text-xs">
          Simone Martini · Partido NOVO Sarandi PR
        </footer>
      </div>

      {stage === "chooseCover" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Qual foto vai ser a capa?</h2>
              <button
                type="button"
                onClick={resetAll}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              As demais fotos entram no restante do carrossel, na ordem em que você enviou.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => chooseCover(i)}
                  className="relative aspect-[1080/1350] rounded-xl overflow-hidden border-2 border-slate-200 hover:border-accent-500 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "editing" && currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">
                {isCoverStep ? "Ajuste a foto de capa" : `Foto ${queuePos} de ${queue.length - 1} do feed`}
              </h2>
              <button
                type="button"
                onClick={resetAll}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              {queue.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < queuePos ? "bg-accent-500" : i === queuePos ? "bg-accent-300" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-slate-500 mb-4 flex items-start gap-2">
              <Move size={16} className="mt-0.5 shrink-0 text-accent-500" />
              Arraste a imagem para movê-la e use o zoom para ajustar o enquadramento.
            </p>

            <div
              ref={stageRef}
              onPointerDown={handleStagePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
              className="relative mx-auto w-full max-w-[320px] rounded-2xl overflow-hidden bg-slate-200 select-none touch-none cursor-move shadow-lg"
              style={{ aspectRatio: `${OUTPUT_W} / ${OUTPUT_H}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto.url}
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

              {!natural && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-slate-400" />
                </div>
              )}

              {/* moldura do mockup (capa/feed): transparente no topo, com degradê para
                  branco e a moldura opaca (barras + logo) na parte de baixo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mockupUrl}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {isCoverStep && title.text.trim() && (
                <div
                  onPointerDown={handleTextPointerDown("title")}
                  className="absolute font-sans font-bold text-white text-center whitespace-nowrap select-none touch-none cursor-move"
                  style={{
                    left: (TITLE_CENTER.x + title.pos.x) * displayScale,
                    top: (TITLE_CENTER.y + title.pos.y) * displayScale,
                    fontSize: title.size * displayScale,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {title.text}
                </div>
              )}

              {isCoverStep && subtitle.text.trim() && (
                <div
                  onPointerDown={handleTextPointerDown("subtitle")}
                  className="absolute font-sans font-bold text-white text-center whitespace-nowrap select-none touch-none cursor-move"
                  style={{
                    left: (SUBTITLE_CENTER.x + subtitle.pos.x) * displayScale,
                    top: (SUBTITLE_CENTER.y + subtitle.pos.y) * displayScale,
                    fontSize: subtitle.size * displayScale,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {subtitle.text}
                </div>
              )}
            </div>

            {isCoverStep && (
              <div className="mt-4 space-y-3">
                <div>
                  <input
                    type="text"
                    value={title.text}
                    onChange={(e) => setTitle((t) => ({ ...t, text: e.target.value.toUpperCase() }))}
                    placeholder="Título (aparece sobre a barra azul)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <Type size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min={TITLE_SIZE_RANGE.min}
                      max={TITLE_SIZE_RANGE.max}
                      step={1}
                      value={title.size}
                      onChange={(e) => setTitle((t) => ({ ...t, size: Number(e.target.value) }))}
                      className="w-full accent-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={subtitle.text}
                    onChange={(e) => setSubtitle((t) => ({ ...t, text: e.target.value.toUpperCase() }))}
                    placeholder="Subtítulo (aparece sobre a barra laranja)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <Type size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min={SUBTITLE_SIZE_RANGE.min}
                      max={SUBTITLE_SIZE_RANGE.max}
                      step={1}
                      value={subtitle.size}
                      onChange={(e) => setSubtitle((t) => ({ ...t, size: Number(e.target.value) }))}
                      className="w-full accent-accent-500"
                    />
                  </div>
                </div>
              </div>
            )}

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
                onClick={resetAll}
                className="flex-1 py-3.5 font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAvancar}
                disabled={!natural || processing}
                className="flex-1 py-3.5 font-bold rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)" }}
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Gerando...
                  </>
                ) : queuePos + 1 < queue.length ? (
                  <>
                    Avançar
                    <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Concluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === "results" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Seu feed está pronto!</h2>
              <button
                type="button"
                onClick={resetAll}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {results.map((item, i) => (
                <div key={item.url} className="text-center">
                  <div className="relative aspect-[1080/1350] rounded-xl overflow-hidden shadow-lg mb-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">{item.label}</p>
                  <button
                    type="button"
                    onClick={() => handleSalvarUma(item, i)}
                    disabled={saving}
                    className="w-full py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                  >
                    <Download size={12} />
                    Baixar
                  </button>
                </div>
              ))}
            </div>

            {saveError && <p className="text-accent-600 text-sm mb-4">{saveError}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="flex-1 py-3.5 font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Criar novo
              </button>
              <button
                type="button"
                onClick={handleSalvarTodas}
                disabled={saving}
                className="flex-1 py-3.5 font-bold rounded-xl text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)" }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Images size={18} />}
                Baixar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
