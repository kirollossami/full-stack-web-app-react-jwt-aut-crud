// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
export const generateToken = (userId) => {
    // eslint-disable-next-line no-undef
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
};

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Check if the data founded 
// eslint-disable-next-line no-undef
const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
// eslint-disable-next-line no-undef
const hasFacebookConfig = process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET;
// eslint-disable-next-line no-undef
const hasMicrosoftConfig = process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET;

// Only if the data available (Google)
if (hasGoogleConfig) {
    passport.use(new GoogleStrategy({
        // eslint-disable-next-line no-undef
        clientID: process.env.GOOGLE_CLIENT_ID,
        // eslint-disable-next-line no-undef
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // eslint-disable-next-line no-undef
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google profile:', profile);
            
            let user = await User.findByProviderId('google', profile.id);
            
            if (user) {
                return done(null, user);
            }

            const email = profile.emails?.[0]?.value;
            if (email) {
                user = await User.findByEmail(email);
            }
            
            if (user) {
                await User.updateUser(user.id, {
                    provider: 'google',
                    provider_id: profile.id,
                    avatar: profile.photos?.[0]?.value
                });
                return done(null, user);
            }

            const newUser = {
                name: profile.displayName,
                email: email || `${profile.id}@google.com`,
                provider: 'google',
                provider_id: profile.id,
                avatar: profile.photos?.[0]?.value,
                password: null
            };

            const userId = await User.create(newUser);
            user = await User.findById(userId);
            
            done(null, user);
        } catch (error) {
            console.error('Google OAuth error:', error);
            done(error, null);
        }
    }));
} else {
    console.log('Google OAuth disabled - missing client ID or secret');
}

// Only if the data available (Facebook)
if (hasFacebookConfig) {
    passport.use(new FacebookStrategy({
        // eslint-disable-next-line no-undef
        clientID: process.env.FACEBOOK_APP_ID,
        // eslint-disable-next-line no-undef
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        // eslint-disable-next-line no-undef
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Facebook profile:', profile);
            
            let user = await User.findByProviderId('facebook', profile.id);
            
            if (user) {
                return done(null, user);
            }

            const email = profile.emails?.[0]?.value;
            if (email) {
                user = await User.findByEmail(email);
            }
            
            if (user) {
                await User.updateUser(user.id, {
                    provider: 'facebook',
                    provider_id: profile.id,
                    avatar: profile.photos?.[0]?.value
                });
                return done(null, user);
            }

            const newUser = {
                name: profile.displayName,
                email: email || `${profile.id}@facebook.com`,
                provider: 'facebook',
                provider_id: profile.id,
                avatar: profile.photos?.[0]?.value,
                password: null
            };

            const userId = await User.create(newUser);
            user = await User.findById(userId);
            
            done(null, user);
        } catch (error) {
            console.error('Facebook OAuth error:', error);
            done(error, null);
        }
    }));
} else {
    console.log('Facebook OAuth disabled - missing app ID or secret');
}

// Only if the data available (Microsoft)
if (hasMicrosoftConfig) {
    passport.use(new MicrosoftStrategy({
        // eslint-disable-next-line no-undef
        clientID: process.env.MICROSOFT_CLIENT_ID,
        // eslint-disable-next-line no-undef
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        // eslint-disable-next-line no-undef
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:5000/api/auth/microsoft/callback',
        scope: ['user.read']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Microsoft profile:', profile);
            
            let user = await User.findByProviderId('microsoft', profile.id);
            
            if (user) {
                return done(null, user);
            }

            const email = profile.emails?.[0]?.value;
            if (email) {
                user = await User.findByEmail(email);
            }
            
            if (user) {
                await User.updateUser(user.id, {
                    provider: 'microsoft',
                    provider_id: profile.id
                });
                return done(null, user);
            }

            const newUser = {
                name: profile.displayName,
                email: email || `${profile.id}@microsoft.com`,
                provider: 'microsoft',
                provider_id: profile.id,
                avatar: null,
                password: null
            };

            const userId = await User.create(newUser);
            user = await User.findById(userId);
            
            done(null, user);
        } catch (error) {
            console.error('Microsoft OAuth error:', error);
            done(error, null);
        }
    }));
} else {
    console.log('Microsoft OAuth disabled - missing client ID or secret');
}

export { passport };