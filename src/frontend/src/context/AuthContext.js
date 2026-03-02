import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            api.setToken(storedToken);
            setToken(storedToken);
            api.verify()
                .then((res) => {
                const r = res;
                if (r.success && r.data) {
                    setUser(r.data);
                }
            })
                .catch(() => {
                api.setToken(null);
                setToken(null);
            })
                .finally(() => setIsLoading(false));
        }
        else {
            setIsLoading(false);
        }
    }, []);
    const login = async (username, password) => {
        const res = await api.login(username, password);
        if (res.success && res.data) {
            api.setToken(res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
        }
    };
    const logout = () => {
        api.logout().catch(() => { });
        api.setToken(null);
        setToken(null);
        setUser(null);
    };
    return (<AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
//# sourceMappingURL=AuthContext.js.map