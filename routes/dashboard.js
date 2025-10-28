/* eslint-disable no-useless-catch */
import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js'; 

const router = express.Router();

// Check database connection
router.get('/dashboard/test-db', async (req, res) => {
  try {
    const test = await executeQuery('SELECT 1 as test');
    res.json({ 
      success: true, 
      message: 'Database connection is working',
      test 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Check
const executeQuery = async (query, params = []) => {
  try {
    if (db.execute) {
      const [rows] = await db.execute(query, params);
      return rows;
    }
  
    else if (db.query) {
      return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
    }
  } catch (error) {
    throw error;
  }
};

// Fetching all data to dashboard page (/dashbaord)
router.get('/dashboard/stats', async (req, res) => {
  try {
    const total_users = await executeQuery('SELECT COUNT(*) as count FROM users');
    const total_rooms = await executeQuery('SELECT COUNT(*) as count FROM rooms');
    const total_bookings = await executeQuery('SELECT COUNT(*) as count FROM bookings');
    const active_bookings = await executeQuery(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE status = 'Confirmed' OR status = 'Pending'`
    );

    const stats = {
      total_users: total_users[0].count,
      total_rooms: total_rooms[0].count,
      total_bookings: total_bookings[0].count,
      active_bookings: active_bookings[0].count
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetching all users
router.get('/dashboard/users', async (req, res) => {
  try {
    const users = await executeQuery(
      `SELECT id, name, email, role, provider, phone, avatar, created_at, updated_at 
       FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new User
router.post('/dashboard/users', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await executeQuery(
      `INSERT INTO users (name, email, password, role, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role || 'user', phone]
    );

    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.insertId,
        name,
        email,
        role: role || 'user',
        phone
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

// Edit user information
router.put('/dashboard/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone } = req.body;

    const result = await executeQuery(
      `UPDATE users SET name = ?, email = ?, role = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, email, role, phone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete user's information
router.delete('/dashboard/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// fetching all bookings
router.get('/dashboard/bookings', async (req, res) => {
  try {
    const bookings = await executeQuery(
      `SELECT b.*, u.name as user_name, u.email as user_email, 
              r.room_name, r.type as room_type, r.price as room_price
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN rooms r ON b.room_id = r.id
       ORDER BY b.created_at DESC`
    );
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update Booking's status
router.put('/dashboard/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await executeQuery(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// booking delete
router.delete('/dashboard/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM bookings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetching all rooms from database
router.get('/dashboard/rooms', async (req, res) => {
  try {
    const rooms = await executeQuery('SELECT * FROM rooms ORDER BY id DESC');
    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new room
router.post('/dashboard/rooms', async (req, res) => {
  try {
    const { room_name, type, price, description, image_url, status } = req.body;

    if (!room_name || !type || !price) {
      return res.status(400).json({ error: 'Room name, type, and price are required' });
    }

    const result = await executeQuery(
      `INSERT INTO rooms (room_name, type, price, description, image_url, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [room_name, type, price, description, image_url, status || 'Available']
    );

    res.json({
      success: true,
      message: 'Room created successfully',
      room: {
        id: result.insertId,
        room_name,
        type,
        price,
        description,
        image_url,
        status: status || 'Available'
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

//Room update
router.put('/dashboard/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { room_name, type, price, description, image_url, status } = req.body;

    const result = await executeQuery(
      `UPDATE rooms SET room_name = ?, type = ?, price = ?, description = ?, 
       image_url = ?, status = ? WHERE id = ?`,
      [room_name, type, price, description, image_url, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// room delete
router.delete('/dashboard/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM rooms WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;