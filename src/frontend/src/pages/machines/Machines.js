import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Machines.css';
export function Machines() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        machineCode: '',
        name: '',
        model: '',
        providerId: '',
        location: '',
    });
    useEffect(() => {
        loadMachines();
    }, []);
    const loadMachines = async () => {
        try {
            const res = await api.getMachines({ pageSize: 100 });
            const data = res;
            setMachines(data.data?.items || []);
        }
        catch (error) {
            console.error('Failed to load machines:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createMachine(formData);
            setShowForm(false);
            setFormData({ machineCode: '', name: '', model: '', providerId: '', location: '' });
            loadMachines();
        }
        catch (error) {
            console.error('Failed to create machine:', error);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('確定要刪除此機台嗎？'))
            return;
        try {
            await api.deleteMachine(id);
            loadMachines();
        }
        catch (error) {
            console.error('Failed to delete machine:', error);
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 'online': return 'status-online';
            case 'offline': return 'status-offline';
            case 'maintenance': return 'status-maintenance';
            default: return '';
        }
    };
    if (loading) {
        return <div className="loading">載入中...</div>;
    }
    return (<div className="machines-page">
      <div className="page-header">
        <h1>機台管理</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 新增機台'}
        </button>
      </div>

      {showForm && (<div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>機台代碼</label>
                <input type="text" value={formData.machineCode} onChange={(e) => setFormData({ ...formData, machineCode: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label>機台名稱</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>型號</label>
                <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })}/>
              </div>
              <div className="form-group">
                <label>位置</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
              </div>
            </div>
            <button type="submit" className="btn-primary">儲存</button>
          </form>
        </div>)}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>代碼</th>
              <th>名稱</th>
              <th>型號</th>
              <th>位置</th>
              <th>狀態</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {machines.length === 0 ? (<tr>
                <td colSpan={7} className="empty">暫無資料</td>
              </tr>) : (machines.map((machine) => (<tr key={machine.id}>
                  <td>{machine.machineCode}</td>
                  <td>{machine.name}</td>
                  <td>{machine.model}</td>
                  <td>{machine.location || '-'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(machine.status)}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td>{new Date(machine.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(machine.id)}>
                      刪除
                    </button>
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>
    </div>);
}
//# sourceMappingURL=Machines.js.map