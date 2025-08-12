import { API_CONFIG } from '../config/api'

// Types for API responses
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// HTTP Client class
export class HttpClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS
  }

  // Get authorization token from localStorage
  private getAuthToken(): string | null {
  return localStorage.getItem('token')
  }

  // Get headers with authorization
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    const token = this.getAuthToken()
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data
    if (isJson) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        errors: data.errors
      }
      throw error
    }

    return data
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString())
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // POST request
  async post<T>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    return this.handleResponse<T>(response)
  }

  // File upload request
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = this.getHeaders()
    // Remove Content-Type for file upload to let browser set it with boundary
    delete headers['Content-Type']

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    return this.handleResponse<T>(response)
  }
}

// Create and export a singleton instance
export const httpClient = new HttpClient()
