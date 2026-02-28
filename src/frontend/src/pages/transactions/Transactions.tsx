import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Transactions.css';

interface Transaction {
  id: string;
  transactionId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  playerId: string;
  machineId?: string;
  status: string;
  remark?: string;
  createdAt: string;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', status: '' });

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      const params: Record<string, string> = { pageSize: '100' };
      if (filter.type) params.type = filter.type;
      if (filter.status) params.status = filter.status;
      
      const res = await api.getTransactions(params);
      const data = res as { success: boolean; data: { items: Transaction[] } };
      setTransactions(data.data?.items || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'bet': return 'type-bet';
      case 'win': return 'type-win';
      case 'deposit': return 'type-deposit';
      case 'withdrawal': return 'type-withdrawal';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  };

  const formatAmount = (amount: number) => {
    return amount >= 0 ? `+${amount.toLocaleString()}` : amount.toLocaleString();
  };

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>交易管理</h1>
      </div>

      <div className="filter-bar">
        <select 
          value={filter.type} 
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">全部類型</option>
          <option value="bet">下注</option>
          <option value="win">贏分</option>
          <option value="deposit">儲值</option>
          <option value="withdrawal">提現</option>
        </select>
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">全部狀態</option>
          <option value="completed">已完成</option>
          <option value="pending">處理中</option>
          <option value="failed">失敗</option>
        </select>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>交易ID</th>
              <th>類型</th>
              <th>金額</th>
              <th>餘額變化</th>
              <th>玩家ID</th>
              <th>狀態</th>
              <th>時間</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">暫無資料</td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.transactionId}</td>
                  <td>
                    <span className={`type-badge ${getTypeClass(txn.type)}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className={`amount ${txn.amount >= 0 ? 'positive' : 'negative'}`}>
                    {formatAmount(txn.amount)}
                  </td>
                  <td>{txn.balanceBefore} → {txn.balanceAfter}</td>
                  <td>{txn.playerId}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
