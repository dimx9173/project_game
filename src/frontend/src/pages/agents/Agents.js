import { useState, useEffect } from 'react';
import { api } from '../../services/api';
export function Agents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { loadAgents(); }, []);
    const loadAgents = async () => {
        try {
            const res = await api.request('/agents');
            setAgents(res.data?.items || []);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return <div className="loading">載入中...</div>;
    return (<div className="agents-page">
      <div className="page-header">
        <h1>代理商管理</h1>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>代碼</th><th>名稱</th><th>上級代理</th><th>佣金率</th><th>狀態</th><th>建立時間</th></tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (<tr><td colSpan={6} className="empty">暫無資料</td></tr>) : agents.map(a => (<tr key={a.id}>
                <td>{a.agentCode}</td><td>{a.name}</td><td>{a.parentAgentId || '-'}</td>
                <td>{(a.commissionRate * 100).toFixed(1)}%</td>
                <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
}
//# sourceMappingURL=Agents.js.map