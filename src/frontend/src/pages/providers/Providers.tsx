import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface Provider {
  id: string;
  providerCode: string;
  name: string;
  status: string;
  gameCount: number;
  createdAt: string;
}

export function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProviders(); }, []);

  const loadProviders = async () => {
    try {
      const res = await api.request<{ success: boolean; data: { items: Provider[] } }>('/providers');
      setProviders(res.data?.items || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading">載入中...</div>;

  return (
    <div className="providers-page">
      <div className="page-header">
        <h1>遊戲商管理</h1>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>代碼</th><th>名稱</th><th>遊戲數</th><th>狀態</th><th>建立時間</th></tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr><td colSpan={5} className="empty">暫無資料</td></tr>
            ) : providers.map(p => (
              <tr key={p.id}>
                <td>{p.providerCode}</td><td>{p.name}</td><td>{p.gameCount}</td>
                <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
