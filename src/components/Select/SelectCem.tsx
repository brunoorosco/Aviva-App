import { useState, useRef, useEffect } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Loading from "./loading";

type DropdownProps = {
  name: string;
  control: Control<any>;
  title: string;
  churchId: string;
  errors?: FieldErrors;
  isRequired?: boolean;
  /**
   * Rede do responsável usada como fallback: quando o fetch de redes falha,
   * o seletor é exibido desabilitado com o nome da rede passada.
   * Sem `fallbackRede`, uma falha apenas mantém o seletor vazio.
   */
  fallbackRede?: { _id: string; name: string } | null;
};

const RETRY_DELAY_MS = 1200;
const MAX_ATTEMPTS = 3;

/**
 * Seletor de rede (CEM).
 *
 * Comportamento:
 * - Faz retry (até 3x) do fetch das redes para cobrir falhas transitórias
 *   observadas em alguns modelos de iPhone.
 * - Se o fetch falhar e `fallbackRede` estiver definido, exibe um Input
 *   desabilitado com o nome da rede do responsável.
 */
export function SelectCem({
  control,
  name,
  title,
  churchId,
  errors,
  isRequired = false,
  fallbackRede = null,
}: DropdownProps) {
  const itemsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const attemptsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appliedFallbackRef = useRef(false);

  const shouldFetch = Boolean(churchId);

  useEffect(() => {
    itemsRef.current = [];
    attemptsRef.current = 0;
    setFailed(false);
    appliedFallbackRef.current = false;

    if (!shouldFetch) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const load = async () => {
      try {
        const res = await fetch(
          `/api/protected/churches/${churchId}/redes`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const json = await res.json();

        if (res.ok && Array.isArray(json)) {
          itemsRef.current = json;
          setIsLoaded(true);
          setIsLoading(false);
          setFailed(false);
          return;
        }
        throw new Error("Resposta inválida");
      } catch (error) {
        console.error("Erro ao carregar redes:", error);
        attemptsRef.current += 1;

        if (attemptsRef.current < MAX_ATTEMPTS) {
          timerRef.current = setTimeout(load, RETRY_DELAY_MS);
          return;
        }

        setFailed(true);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [churchId, shouldFetch]);

  const required = isRequired ? { required: "Selecione uma Rede" } : {};

  // Quando o fetch falha e há fallback, o seletor vira um input desabilitado
  // com o nome da rede do responsável.
  const isLocked = Boolean(failed && fallbackRede);

  // Garante (uma vez) que o form tenha o _id/name da rede do responsável
  // quando o fallback entra em ação.
  useEffect(() => {
    if (!isLocked || !fallbackRede || appliedFallbackRef.current) return;
    appliedFallbackRef.current = true;
    (control as any).setValue?.(name, {
      _id: fallbackRede._id,
      name: fallbackRede.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, fallbackRede]);

  if (isLocked && fallbackRede) {
    return (
      <div className="flex flex-col w-full">
        <Controller
          name={name}
          control={control}
          rules={required}
          render={({ field }) => (
            <div className="w-full rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-foreground shadow-sm transition-colors md:text-sm">
              {typeof field.value === "object"
                ? field.value?.name || fallbackRede.name
                : (field.value as string) || fallbackRede.name}
            </div>
          )}
        />
        {errors?.[name] && (
          <p className="mt-2 text-sm text-destructive">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Controller
        name={name}
        control={control}
        rules={required}
        render={({ field }) => {
          const selectedId =
            typeof field.value === "object" && field.value?._id
              ? field.value._id
              : typeof field.value === "string"
                ? field.value.split("-")[0]
                : "";

          const handleChange = (id: string) => {
            const rede = itemsRef.current.find((r) => r._id === id);
            if (rede && field.onChange) {
              field.onChange({ _id: rede._id, name: rede.name });
            }
          };

          return (
            <Select
              onValueChange={handleChange}
              value={selectedId}
              disabled={!isLoaded || isLoading}
            >
              <SelectTrigger className="w-full bg-gray-200 dark:bg-zinc-700 dark:text-gray-100">
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Carregando redes..."
                      : failed
                        ? "Falha ao carregar redes"
                        : title
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoading && <Loading />}
                {!isLoading &&
                  isLoaded &&
                  itemsRef.current.map((item: any) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {errors?.[name] && (
        <p className="mt-2 text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}