"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, ImagePlus, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const POTENCIAL_OPCOES = [
  { value: "solo", label: "Apoiador solo" },
  { value: "familiar", label: "Núcleo familiar" },
  { value: "30-50", label: "30 - 50 pessoas" },
  { value: "50-80", label: "50 - 80 pessoas" },
  { value: "80-120", label: "80 - 120 pessoas" },
  { value: "120+", label: "120 +" },
] as const;

const SITUACAO_OPCOES = [
  "Fechado com Simone",
  "Em conversa",
  "Entrar em contato",
] as const;

type FormValues = {
  nome: string;
  telefone: string;
  cidade: string;
  rua: string;
  numero: string;
  descricao: string;
  potencialInfluencia: string;
  situacao: string;
  responsavel: string;
};

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full px-4 py-3 rounded-lg border bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
    hasError ? "border-red-500" : "border-slate-200"
  );

export default function LiderancasPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>();

  const formatTelefone = (input: string) => {
    let digits = input.replace(/\D/g, "");
    if (digits.length > 11) digits = digits.slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    e.target.value = formatted;
    setValue("telefone", formatted, { shouldValidate: true });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClearForm = () => {
    reset();
    clearImage();
    setIsSubmitted(false);
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("telefone", data.telefone);
    formData.append("cidade", data.cidade);
    formData.append("rua", data.rua);
    formData.append("numero", data.numero);
    formData.append("descricao", data.descricao);
    formData.append("potencialInfluencia", data.potencialInfluencia);
    formData.append("situacao", data.situacao);
    formData.append("responsavel", data.responsavel);
    if (imageFile) formData.append("imagem", imageFile);

    try {
      const response = await fetch(
        "https://ucezjskktvkhkmtqzdyc.supabase.co/functions/v1/submit-lideranca",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao salvar os dados");
      }

      reset();
      clearImage();
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Erro no envio:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar. Tente novamente."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Cadastro salvo!</h2>
            <p className="text-slate-600 max-w-sm">
              Os dados da liderança foram registrados com sucesso.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-2">
                Nome *
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Nome completo"
                className={inputClass(!!errors.nome)}
                {...register("nome", { required: "O nome é obrigatório" })}
              />
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700 mb-2">
                Telefone *
              </label>
              <input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                className={inputClass(!!errors.telefone)}
                {...register("telefone", {
                  required: "O telefone é obrigatório",
                  onChange: handleTelefoneChange,
                  validate: (value) => {
                    const digits = value.replace(/\D/g, "");
                    return (
                      (digits.length === 10 || digits.length === 11) ||
                      "Telefone inválido"
                    );
                  },
                })}
              />
              {errors.telefone && (
                <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>
              )}
            </div>

            {/* Endereço separado em Cidade / Rua / Número */}
            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-3">
                Endereço *
              </span>
              <div className="space-y-3">
                <div>
                  <label htmlFor="cidade" className="block text-xs text-slate-500 mb-1">
                    Cidade
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Ex: Londrina"
                    className={inputClass(!!errors.cidade)}
                    {...register("cidade", { required: "A cidade é obrigatória" })}
                  />
                  {errors.cidade && (
                    <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="rua" className="block text-xs text-slate-500 mb-1">
                      Rua / Avenida
                    </label>
                    <input
                      id="rua"
                      type="text"
                      placeholder="Ex: Rua das Flores"
                      className={inputClass(!!errors.rua)}
                      {...register("rua", { required: "A rua é obrigatória" })}
                    />
                    {errors.rua && (
                      <p className="text-red-500 text-xs mt-1">{errors.rua.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="numero" className="block text-xs text-slate-500 mb-1">
                      Número
                    </label>
                    <input
                      id="numero"
                      type="text"
                      placeholder="Ex: 123"
                      className={inputClass(!!errors.numero)}
                      {...register("numero", { required: "O número é obrigatório" })}
                    />
                    {errors.numero && (
                      <p className="text-red-500 text-xs mt-1">{errors.numero.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-semibold text-slate-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="descricao"
                rows={4}
                placeholder="Informações sobre a liderança, atuação, observações..."
                className={cn(inputClass(!!errors.descricao), "resize-y")}
                {...register("descricao", { required: "A descrição é obrigatória" })}
              />
              {errors.descricao && (
                <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="potencialInfluencia" className="block text-sm font-semibold text-slate-700 mb-2">
                Potencial de influência *
              </label>
              <select
                id="potencialInfluencia"
                className={inputClass(!!errors.potencialInfluencia)}
                defaultValue=""
                {...register("potencialInfluencia", {
                  required: "Selecione o potencial de influência",
                })}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {POTENCIAL_OPCOES.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
              {errors.potencialInfluencia && (
                <p className="text-red-500 text-xs mt-1">{errors.potencialInfluencia.message}</p>
              )}
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-3">
                Situação *
              </span>
              <div className="space-y-2">
                {SITUACAO_OPCOES.map((opcao) => (
                  <label
                    key={opcao}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50/30"
                  >
                    <input
                      type="radio"
                      value={opcao}
                      className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                      {...register("situacao", { required: "Selecione a situação" })}
                    />
                    <span className="text-sm text-slate-700">{opcao}</span>
                  </label>
                ))}
              </div>
              {errors.situacao && (
                <p className="text-red-500 text-xs mt-1">{errors.situacao.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="responsavel" className="block text-sm font-semibold text-slate-700 mb-2">
                Responsável
              </label>
              <input
                id="responsavel"
                type="text"
                placeholder="Nome do responsável pelo contato"
                className={inputClass()}
                {...register("responsavel")}
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2">
                Imagem
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-brand-400 transition-colors flex items-center justify-center gap-2 text-slate-600 font-medium"
              >
                <ImagePlus size={20} />
                {imageFile ? "Trocar imagem" : "Anexar imagem"}
              </button>

              {imagePreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="max-h-40 rounded-lg border border-slate-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    aria-label="Remover imagem"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-slate-500 mt-2">{imageFile?.name}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Salvar
                    <Save size={18} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200"
              >
                Limpar formulário
                <Trash2 size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
