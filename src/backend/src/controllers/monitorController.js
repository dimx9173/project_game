// Simulated real-time data
const monitorData = new Map();
export const getAllMachines = (req, res) => {
    const items = Array.from(monitorData.values());
    res.json({ success: true, data: items });
};
export const getMachineStatus = (req, res) => {
    const data = monitorData.get(req.params.id);
    data ? res.json({ success: true, data }) : res.status(404).json({ success: false, error: 'Machine not found' });
};
export const getDashboardStats = (req, res) => {
    const machines = Array.from(monitorData.values());
    const online = machines.filter(m => m.status === 'online').length;
    const offline = machines.filter(m => m.status === 'offline').length;
    const error = machines.filter(m => m.status === 'error').length;
    const totalBet = machines.reduce((sum, m) => sum + m.todayBet, 0);
    const totalWin = machines.reduce((sum, m) => sum + m.todayWin, 0);
    res.json({
        success: true,
        data: {
            totalMachines: machines.length,
            online,
            offline,
            error,
            totalBet,
            totalWin,
            netProfit: totalBet - totalWin,
            timestamp: new Date()
        }
    });
};
export const getAlerts = (req, res) => {
    const machines = Array.from(monitorData.values());
    const alerts = machines
        .filter(m => m.status === 'error' || m.cpu > 90 || m.memory > 90)
        .map(m => ({
        machineId: m.machineId,
        type: m.status === 'error' ? 'error' : m.cpu > 90 ? 'high_cpu' : 'high_memory',
        message: m.status === 'error' ? 'Machine error' : m.cpu > 90 ? 'High CPU usage' : 'High memory usage',
        timestamp: new Date()
    }));
    res.json({ success: true, data: alerts });
};
//# sourceMappingURL=monitorController.js.map