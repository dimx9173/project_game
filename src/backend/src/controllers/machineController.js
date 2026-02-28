// In-memory store
const machines = new Map();
export const getMachines = (req, res) => {
    const { page = 1, pageSize = 20, status } = req.query;
    let items = Array.from(machines.values());
    if (status) {
        items = items.filter(m => m.status === status);
    }
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
export const getMachineById = (req, res) => {
    const { id } = req.params;
    const machine = machines.get(id);
    if (!machine) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    res.json({ success: true, data: machine });
};
export const createMachine = (req, res) => {
    const { machineCode, name, model, providerId, location } = req.body;
    const machine = {
        id: `machine_${Date.now()}`,
        machineCode,
        name,
        model,
        providerId,
        location,
        status: 'offline',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    machines.set(machine.id, machine);
    res.status(201).json({ success: true, data: machine });
};
export const updateMachine = (req, res) => {
    const { id } = req.params;
    const machine = machines.get(id);
    if (!machine) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    const updated = { ...machine, ...req.body, updatedAt: new Date() };
    machines.set(id, updated);
    res.json({ success: true, data: updated });
};
export const deleteMachine = (req, res) => {
    const { id } = req.params;
    if (!machines.has(id)) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    machines.delete(id);
    res.json({ success: true, message: 'Machine deleted' });
};
//# sourceMappingURL=machineController.js.map