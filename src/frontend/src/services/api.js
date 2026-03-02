// Use relative URL to go through vite proxy in dev, or configured URL in prod
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';
class ApiService {
    token = null;
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.removeItem('token');
        }
    }
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }
    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
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
    login(username, password) {
        return this.request('/auth/login', {
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
    getMachines(params) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/machines${query}`);
    }
    getMachine(id) {
        return this.request(`/machines/${id}`);
    }
    createMachine(data) {
        return this.request('/machines', { method: 'POST', body: JSON.stringify(data) });
    }
    updateMachine(id, data) {
        return this.request(`/machines/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }
    deleteMachine(id) {
        return this.request(`/machines/${id}`, { method: 'DELETE' });
    }
    // Players
    getPlayers(params) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/players${query}`);
    }
    getPlayer(id) {
        return this.request(`/players/${id}`);
    }
    createPlayer(data) {
        return this.request('/players', { method: 'POST', body: JSON.stringify(data) });
    }
    updatePlayer(id, data) {
        return this.request(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }
    // Transactions
    getTransactions(params) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/transactions${query}`);
    }
}
export const api = new ApiService();
//# sourceMappingURL=api.js.map