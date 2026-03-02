const providers = new Map();
export const getProviders = (req, res) => {
    const { page = 1, pageSize = 20, status } = req.query;
    let items = Array.from(providers.values());
    if (status)
        items = items.filter(p => p.status === status);
    res.json({ success: true, data: { items, total: items.length, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(items.length / Number(pageSize)) } });
};
export const getProviderById = (req, res) => {
    const provider = providers.get(req.params.id);
    provider ? res.json({ success: true, data: provider }) : res.status(404).json({ success: false, error: 'Provider not found' });
};
export const createProvider = (req, res) => {
    const provider = { id: `prov_${Date.now()}`, ...req.body, createdAt: new Date() };
    providers.set(provider.id, provider);
    res.status(201).json({ success: true, data: provider });
};
export const updateProvider = (req, res) => {
    const provider = providers.get(req.params.id);
    if (!provider) {
        res.status(404).json({ success: false, error: 'Provider not found' });
        return;
    }
    const updated = { ...provider, ...req.body };
    providers.set(provider.id, updated);
    res.json({ success: true, data: updated });
};
//# sourceMappingURL=providerController.js.map