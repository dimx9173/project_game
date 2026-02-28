import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Games.css';

interface Game {
  id: string;
  gameCode: string;
  name: string;
  providerId: string;
  status: string;
  createdAt: string;
}

export function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGames(); }, []);

  const loadGames = async () => {
    try {
      const res = await api.request<{ success: boolean; data: { items: Game[] } }>('/games');
      setGames(res.data?.items || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading">載入中...</div>;

  return (
    <div className="games-page">
      <div className="page-header">
        <h1>遊戲管理</h1>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>代碼</th><th>名稱</th><th>供應商ID</th><th>狀態</th><th>建立時間</th></tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr><td colSpan={5} className="empty">暫無資料</td></tr>
            ) : games.map(g => (
              <tr key={g.id}>
                <td>{g.gameCode}</td><td>{g.name}</td><td>{g.providerId}</td>
                <td><span className={`status-badge status-${g.status}`}>{g.status}</span></td>
                <td>{new Date(g.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
