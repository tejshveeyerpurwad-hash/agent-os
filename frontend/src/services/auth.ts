import api from './api'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const { data: response } = await api.post('/auth/register', data)
    return response
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get('/auth/me')
    return data
  },
}
