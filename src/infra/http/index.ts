import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { randomUUID } from 'node:crypto'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestId = randomUUID() // Gera um ID único para a requisição

        // Verifica se os headers já estão no formato AxiosHeaders, se não, cria um novo
        if (!config.headers) {
          config.headers = new AxiosHeaders()
        }

        // Define o cabeçalho 'X-Request-ID'
        ;(config.headers as AxiosHeaders).set('X-Request-ID', requestId)

        console.log(
          `Requisição ${config.method?.toUpperCase()} iniciada com ID: ${requestId}`
        )
        return config
      }
    )

    // Adiciona o interceptor para a resposta
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.headers['X-Request-ID']
        console.log(
          `Resposta da requisição ${response.config.method?.toUpperCase()} com ID: ${requestId}`
        )
        console.log(`Status: ${response.status}`)
        console.log('Dados retornados:', response.data)
        return response
      },
      (error) => {
        if (error.response) {
          const requestId = error.response.config.headers['X-Request-ID']
          console.error(
            `Erro na requisição ${error.response.config.method?.toUpperCase()} com ID: ${requestId}`
          )
          console.error(`Status: ${error.response.status}`)
          console.error('Erro:', error.response.data)
        }
        return Promise.reject(error)
      }
    )
  }

  // Método GET genérico
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
      url,
      config
    )
    return response.data
  }

  // Método POST genérico
  async post<T, U>(
    url: string,
    data: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
      url,
      data,
      config
    )
    return response.data
  }

  // Método PUT genérico
  async put<T, U>(
    url: string,
    data: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
      url,
      data,
      config
    )
    return response.data
  }

  // Método DELETE genérico
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
      url,
      config
    )
    return response.data
  }
}

export default ApiService
