// routes/rooms.js
import express from 'express';
import db from '../config/db.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rooms] = await db.execute(`
      SELECT 
        id,
        room_name,
        type,
        price,
        description,
        image_url,
        status
      FROM rooms 
      WHERE status = 'available'
      ORDER BY price ASC
    `);

    if (rooms.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: "No rooms available"
      });
    }

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms data'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const roomId = req.params.id;

    const [rooms] = await db.execute(
      `SELECT 
        id,
        room_name,
        type,
        price,
        description,
        image_url,
        status
      FROM rooms 
      WHERE id = ? AND status = 'available'`,
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not available'
      });
    }

    const room = rooms[0];
    res.json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room data'
    });
  }
});

export default router;