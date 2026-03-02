const agents = new Map();
export const getAgents = (req, res) => {
    const { page = 1, pageSize = 20, parentAgentId, status } = req.query;
    let items = Array.from(agents.values());
    if (parentAgentId)
        items = items.filter(a => a.parentAgentId === parentAgentId);
    if (status)
        items = items.filter(a => a.status === status);
    res.json({ success: true, data: { items, total: items.length, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(items.length / Number(pageSize)) } });
};
export const getAgentById = (req, res) => {
    const agent = agents.get(req.params.id);
    agent ? res.json({ success: true, data: agent }) : res.status(404).json({ success: false, error: 'Agent not found' });
};
export const createAgent = (req, res) => {
    const agent = { id: `agent_${Date.now()}`, ...req.body, createdAt: new Date() };
    agents.set(agent.id, agent);
    res.status(201).json({ success: true, data: agent });
};
export const updateAgent = (req, res) => {
    const agent = agents.get(req.params.id);
    if (!agent) {
        res.status(404).json({ success: false, error: 'Agent not found' });
        return;
    }
    const updated = { ...agent, ...req.body };
    agents.set(agent.id, updated);
    res.json({ success: true, data: updated });
};
//# sourceMappingURL=agentController.js.map