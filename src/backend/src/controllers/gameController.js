const games = new Map();
export const getGames = (req, res) => {
    const { page = 1, pageSize = 20, providerId, status } = req.query;
    let items = Array.from(games.values());
    if (providerId)
        items = items.filter(g => g.providerId === providerId);
    if (status)
        items = items.filter(g => g.status === status);
    const total = items.length;
    res.json({ success: true, data: { items, total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / Number(pageSize)) } });
};
export const getGameById = (req, res) => {
    const game = games.get(req.params.id);
    game ? res.json({ success: true, data: game }) : res.status(404).json({ success: false, error: 'Game not found' });
};
export const createGame = (req, res) => {
    const game = { id: `game_${Date.now()}`, ...req.body, createdAt: new Date(), updatedAt: new Date() };
    games.set(game.id, game);
    res.status(201).json({ success: true, data: game });
};
export const updateGame = (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
        res.status(404).json({ success: false, error: 'Game not found' });
        return;
    }
    const updated = { ...game, ...req.body, updatedAt: new Date() };
    games.set(game.id, updated);
    res.json({ success: true, data: updated });
};
//# sourceMappingURL=gameController.js.map