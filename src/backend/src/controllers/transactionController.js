const transactions = new Map();
export const getTransactions = (req, res) => {
    const { page = 1, pageSize = 20, type, status, playerId, machineId, startDate, endDate } = req.query;
    let items = Array.from(transactions.values());
    if (type)
        items = items.filter(t => t.type === type);
    if (status)
        items = items.filter(t => t.status === status);
    if (playerId)
        items = items.filter(t => t.playerId === playerId);
    if (machineId)
        items = items.filter(t => t.machineId === machineId);
    // Sort by createdAt desc
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = items.length;
    const pageNum = Number(page);
    const size = Number(pageSize);
    res.json({
        success: true,
        data: {
            items: items.slice((pageNum - 1) * size, pageNum * size),
            total,
            page: pageNum,
            pageSize: size,
            totalPages: Math.ceil(total / size)
        }
    });
};
export const getTransactionById = (req, res) => {
    const { id } = req.params;
    const transaction = transactions.get(id);
    if (!transaction) {
        res.status(404).json({ success: false, error: 'Transaction not found' });
        return;
    }
    res.json({ success: true, data: transaction });
};
export const createTransaction = (req, res) => {
    const { type, amount, playerId, machineId, remark } = req.body;
    // Get player's current balance
    // In real app, fetch from player service
    const balanceBefore = 0;
    const balanceAfter = balanceBefore + amount;
    const transaction = {
        id: `txn_${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        playerId,
        machineId,
        operatorId: req.user?.userId,
        status: 'completed',
        remark,
        createdAt: new Date()
    };
    transactions.set(transaction.id, transaction);
    res.status(201).json({ success: true, data: transaction });
};
// Bet operation
export const placeBet = (req, res) => {
    const { playerId, machineId, amount, remark } = req.body;
    const transaction = {
        id: `txn_${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        type: 'bet',
        amount: -Math.abs(amount),
        balanceBefore: 0,
        balanceAfter: -Math.abs(amount),
        playerId,
        machineId,
        operatorId: req.user?.userId,
        status: 'completed',
        remark,
        createdAt: new Date()
    };
    transactions.set(transaction.id, transaction);
    res.status(201).json({ success: true, data: transaction });
};
// Settlement (win)
export const settleWin = (req, res) => {
    const { playerId, machineId, amount, remark } = req.body;
    const transaction = {
        id: `txn_${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        type: 'win',
        amount: Math.abs(amount),
        balanceBefore: 0,
        balanceAfter: Math.abs(amount),
        playerId,
        machineId,
        operatorId: req.user?.userId,
        status: 'completed',
        remark,
        createdAt: new Date()
    };
    transactions.set(transaction.id, transaction);
    res.status(201).json({ success: true, data: transaction });
};
//# sourceMappingURL=transactionController.js.map