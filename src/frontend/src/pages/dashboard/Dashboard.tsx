import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

interface Stats {
  totalMachines: number;
  online: number;
  offline: number;
  error: number;
  totalBet: number;
  totalWin: number;
  netProfit: number;
}

interface MachineMonitor {
  machineId: string;
  status: string;
  cpu: number;
  memory: number;
  todayBet: number;
  todayWin: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalMachines: 0, online: 0, offline: 0, error: 0, totalBet: 0, totalWin: 0, netProfit: 0 });
  const [machines, setMachines] = useState<MachineMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // Try monitor API first
      const [statsRes, machinesRes, alertsRes] = await Promise.all([
        api.request<{ success: boolean; data: Stats }>('/monitor/dashboard').catch(() => ({ success: false })),
        api.request<{ success: boolean; data: MachineMonitor[] }>('/monitor/machines').catch(() => ({ success: false })),
        api.request<{ success: boolean; data: any[] }>('/monitor/alerts').catch(() => ({ success: false }))
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (machinesRes.success) setMachines(machinesRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading">載入中...</div>;

  return (
    <div className="dashboard">
      <h1>儀表板</h1>
      
      {/* Stats Cards */}
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
            <div className="stat-value">{stats.online}</div>
            <div className="stat-label">在線</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon offline">✗</div>
          <div className="stat-content">
            <div className="stat-value">{stats.offline}</div>
            <div className="stat-label">離線</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error">⚠</div>
          <div className="stat-content">
            <div className="stat-value">{stats.error}</div>
            <div className="stat-label">異常</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBet.toLocaleString()}</div>
            <div className="stat-label">總投注</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: stats.netProfit >= 0 ? '#00ff88' : '#ff4757' }}>
              {stats.netProfit.toLocaleString()}
            </div>
            <div className="stat-label">淨利潤</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>⚠️ 警訊</h2>
          <div className="alerts-list">
            {alerts.map((alert, i) => (
              <div key={i} className={`alert-item alert-${alert.type}`}>
                <strong>{alert.machineId}</strong>: {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Machines */}
      {machines.length > 0 && (
        <div className="machines-section">
          <h2>即時機台狀態</h2>
          <div className="machines-grid">
            {machines.map(m => (
              <div key={m.machineId} className={`machine-card status-${m.status}`}>
                <div className="machine-header">
                  <span className="machine-id">{m.machineId}</span>
                  <span className={`status-badge ${m.status}`}>{m.status}</span>
                </div>
                <div className="machine-stats">
                  <div>CPU: {m.cpu}%</div>
                  <div>Memory: {m.memory}%</div>
                  <div>Bet: {m.todayBet.toLocaleString()}</div>
                  <div>Win: {m.todayWin.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
