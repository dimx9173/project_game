const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  login(username: string, password: string) {
    return this.request<{ success: boolean; data: { token: string; user: unknown } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  verify() {
    return this.request('/auth/verify', { method: 'GET' });
  }

  // Machines
  getMachines(params?: Record<string, unknown>) {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request(`/machines${query}`);
  }

  getMachine(id: string) {
    return this.request(`/machines/${id}`);
  }

  createMachine(data: unknown) {
    return this.request('/machines', { method: 'POST', body: JSON.stringify(data) });
  }

  updateMachine(id: string, data: unknown) {
    return this.request(`/machines/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  deleteMachine(id: string) {
    return this.request(`/machines/${id}`, { method: 'DELETE' });
  }

  // Players
  getPlayers(params?: Record<string, unknown>) {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request(`/players${query}`);
  }

  getPlayer(id: string) {
    return this.request(`/players/${id}`);
  }

  createPlayer(data: unknown) {
    return this.request('/players', { method: 'POST', body: JSON.stringify(data) });
  }

  updatePlayer(id: string, data: unknown) {
    return this.request(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Transactions
  getTransactions(params?: Record<string, unknown>) {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.request(`/transactions${query}`);
  }
}

export const api = new ApiService();
