import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STUDENT',
            },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, forceLogin } = req.body;
        const device = req.headers['user-agent'] || 'unknown';
        const ip = req.ip || 'unknown';

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            await prisma.loginHistory.create({
                data: { userId: user?.id || 'unknown', device, ip, status: 'FAILED' }
            });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Handle force login (clear all existing sessions)
        if (forceLogin) {
            await prisma.session.deleteMany({ where: { userId: user.id } });
            await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        }

        // Device limit check (increased to 5)
        const activeSessions = await prisma.session.count({ where: { userId: user.id } });
        if (activeSessions >= 5) {
            return res.status(403).json({
                message: 'Device limit reached.',
                error: 'DEVICE_LIMIT_REACHED',
                currentSessions: activeSessions,
                maxSessions: 5
            });
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token in DB
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        // Create session
        await prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                device,
                ip,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
            }
        });

        await prisma.loginHistory.create({
            data: { userId: user.id, device, ip, status: 'SUCCESS' }
        });

        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

        const tokenData = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!tokenData || tokenData.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const payload = verifyRefreshToken(refreshToken) as any;
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });

        if (!user) return res.status(401).json({ message: 'User not found' });

        const newAccessToken = generateAccessToken(user.id, user.role);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        // Also clear session if needed
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout' });
    }
};
