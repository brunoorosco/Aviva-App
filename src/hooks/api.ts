import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import useSWR, { SWRConfiguration } from "swr";

interface IPost<T> {
  url: string;
  data: T;
  headers?: { [key: string]: string };
}

interface IPatch<T> {
  url: string;
  data: Partial<T>; // Para PATCH faz sentido ser parcial, PUT geralmente é completo
}

interface IDelete {
  url: string;
}
interface IResponseData<T> {
  data: T;
  headers: Record<string, any>;
}

interface FetcherResponse<T> {
  data: T;
  headers: Record<string, any>;
}

const fetcher = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<FetcherResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, config);
    return { data: response.data, headers: response.headers };
  } catch (error: any) {
    // Lança erro padronizado pro SWR entender
    throw new Error(error.response?.data?.message || error.message || "Erro ao buscar dados");
  }
};

/**
 * Hook customizado para requisições GET usando SWR
 */
const useHttpGet = <T = unknown>(
  url: string | null,
  config?: AxiosRequestConfig,
  swrOptions?: SWRConfiguration<FetcherResponse<T>, Error>
) => {
  // 🔧 Solução do erro: declarar explicitamente a key e o tipo da função
  return useSWR<FetcherResponse<T>, Error>(
    url ? ([url, config] as const) : null, // <- "as const" garante tipagem da tupla
    (args: any) => {
      const [url, config] = args as readonly [string, AxiosRequestConfig?];
      return fetcher<T>(url, config);
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...swrOptions,
    }
  );
};

const useHttpPost = async <T>({ url, data, headers }: IPost<T>) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

const useHttpPatch = async <T>({ url, data }: IPatch<T>) => {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

const useHttpPut = async <T>({ url, data }: IPatch<T>) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

const useHttpDelete = async ({ url }: IDelete) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });

  return res.json();
};

export { useHttpDelete, useHttpPatch, useHttpGet, useHttpPost, useHttpPut };
