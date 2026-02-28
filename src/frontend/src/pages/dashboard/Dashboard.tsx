import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

interface Stats {
  totalMachines: number;
  onlineMachines: number;
  totalPlayers: number;
  activePlayers: number;
  todayTransactions: number;
  todayAmount: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMachines: 0,
    onlineMachines: 0,
    totalPlayers: 0,
    activePlayers: 0,
    todayTransactions: 0,
    todayAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [machinesRes, playersRes, txnsRes] = await Promise.all([
        api.getMachines({ pageSize: 1000 }),
        api.getPlayers({ pageSize: 1000 }),
        api.getTransactions({ pageSize: 1000 }),
      ]);

      const machines = machinesRes as { success: boolean; data: { items: unknown[] } };
      const players = playersRes as { success: boolean; data: { items: unknown[] } };
      const txns = txnsRes as { success: boolean; data: { items: { amount: number }[] } };

      const machineList = machines.data?.items || [];
      const playerList = players.data?.items || [];
      const txnList = txns.data?.items || [];

      setStats({
        totalMachines: machineList.length,
        onlineMachines: machineList.filter((m: unknown) => (m as { status: string }).status === 'online').length,
        totalPlayers: playerList.length,
        activePlayers: playerList.filter((p: unknown) => (p as { status: string }).status === 'active').length,
        todayTransactions: txnList.length,
        todayAmount: txnList.reduce((sum, t) => sum + t.amount, 0),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="dashboard">
      <h1>儀表板</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMachines}</div>
            <div className="stat-label">總機台數</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon online">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.onlineMachines}</div>
            <div className="stat-label">在線機台</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPlayers}</div>
            <div className="stat-label">總玩家數</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activePlayers}</div>
            <div className="stat-label">活躍玩家</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.todayTransactions}</div>
            <div className="stat-label">今日交易筆數</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-value">{stats.todayAmount.toLocaleString()}</div>
            <div className="stat-label">今日交易金額</div>
          </div>
        </div>
      </div>
    </div>
  );
}
