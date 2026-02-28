import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Players.css';

interface Player {
  id: string;
  playerCode: string;
  username: string;
  phone?: string;
  email?: string;
  level: number;
  balance: number;
  status: string;
  createdAt: string;
}

export function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    level: 1,
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await api.getPlayers({ pageSize: 100 });
      const data = res as { success: boolean; data: { items: Player[] } };
      setPlayers(data.data?.items || []);
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlayer(formData);
      setShowForm(false);
      setFormData({ username: '', phone: '', email: '', level: 1 });
      loadPlayers();
    } catch (error) {
      console.error('Failed to create player:', error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'banned': return 'status-banned';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="players-page">
      <div className="page-header">
        <h1>玩家管理</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 新增玩家'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>帳號</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>電話</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>等級</label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">儲存</button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>代碼</th>
              <th>帳號</th>
              <th>電話</th>
              <th>等級</th>
              <th>餘額</th>
              <th>狀態</th>
              <th>建立時間</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">暫無資料</td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id}>
                  <td>{player.playerCode}</td>
                  <td>{player.username}</td>
                  <td>{player.phone || '-'}</td>
                  <td>{player.level}</td>
                  <td>{player.balance.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(player.status)}`}>
                      {player.status}
                    </span>
                  </td>
                  <td>{new Date(player.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
