// routes/user.js
import express from 'express';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

//Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const fields = [];
    const values = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (phone) { fields.push('phone = ?'); values.push(phone); }

    if (!fields.length) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.user.id);

    await db.execute(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    const [updatedRows] = await db.execute(
      'SELECT id, name, email, phone, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ success: true, user: updatedRows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

//Update password
router.put('/password', auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ success: false, message: 'Password update failed' });
  }
});

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await db.execute(
      'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
      [avatarPath, req.user.id]
    );

    res.json({ success: true, avatarUrl: avatarPath });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: 'Avatar upload failed' });
  }
});

export default router;
