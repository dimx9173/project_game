import jwt from 'jsonwebtoken';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
const users = new Map([
    ['admin', { id: '1', username: 'admin', passwordHash: 'hashed', role: 'admin', email: 'admin@game.com', status: 'active', createdAt: new Date(), updatedAt: new Date() }]
]);
export const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.get(username);
    if (!user || password !== 'admin123') {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
    }
    const token = generateToken({ userId: user.id, username: user.username, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, username: user.username, role: user.role });
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: { token, refreshToken, user: userWithoutPassword }
    });
};
export const logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};
export const verify = (req, res) => {
    res.json({ success: true, data: req.user });
};
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ success: false, error: 'Refresh token required' });
        return;
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'dev-secret-key');
        const newToken = generateToken(decoded);
        res.json({ success: true, data: { token: newToken } });
    }
    catch {
        res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
};
//# sourceMappingURL=authController.js.map