import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../config/passport.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userId = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'local'
        });

        const token = generateToken(userId);
        const user = await User.findById(userId);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                avatar: user.avatar,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

export const oauthCallback = (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user.id);

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            provider: user.provider,
            avatar: user.avatar
        };

        res.redirect(
            // eslint-disable-next-line no-undef
            `${process.env.FRONTEND_URL}/auth/success?` +
            `token=${token}&` +
            `user=${encodeURIComponent(JSON.stringify(userData))}`
        );
    } catch (error) {
        console.error('OAuth callback error:', error);
        // eslint-disable-next-line no-undef
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
};

export const oauthFailure = (req, res) => {
    // eslint-disable-next-line no-undef
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                avatar: user.avatar,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};