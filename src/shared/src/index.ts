// User types
export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

// Game types
export interface Game {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
