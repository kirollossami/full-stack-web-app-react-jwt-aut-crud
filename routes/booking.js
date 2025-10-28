// routes/booking.js
import express from "express";
import db from "../config/db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get availables rooms
router.get("/available-rooms", async (req, res) => {
  try {
    const [rooms] = await db.execute(`
      SELECT id, room_name AS name, type, price, description, image_url, status 
      FROM rooms 
      WHERE status = 'available'
    `);
    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({ success: false, message: "Error fetching rooms" });
  }
});

// Booking room (Price calculating + security)
router.post("/book", auth, async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const userId = req.user.id; 
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: "Missing booking details" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: "Invalid check-in/check-out dates" });
    }

    await connection.beginTransaction();

    // Check availability rooms
    const [roomRows] = await connection.execute(
      `SELECT price, status FROM rooms WHERE id = ? FOR UPDATE`,
      [roomId]
    );

    if (!roomRows.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const room = roomRows[0];
    if (room.status !== "available") {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Room is already booked" });
    }

    // Claculating the days and pricing 
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * diffDays;

   // Insert booking into database
    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, roomId, checkInDate, checkOutDate, totalPrice]
    );

    // Update room status
    await connection.execute(`UPDATE rooms SET status = 'booked' WHERE id = ?`, [roomId]);

    await connection.commit();

    res.json({
      success: true,
      message: "Booking successful!",
      bookingId: bookingResult.insertId,
      totalPrice,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Booking failed", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Booking Cancellation
router.put("/cancel-booking/:bookingId", auth, async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const { bookingId } = req.params;
    const userId = req.user.id; 

    await connection.beginTransaction();

    const [bookings] = await connection.execute(
      `SELECT b.*, r.id as room_id 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    );

    if (!bookings.length) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found or you don't have permission to cancel this booking" 
      });
    }

    const booking = bookings[0];
    await connection.execute(
      `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
      [bookingId]
    );

    // Update room status into availabe
    await connection.execute(
      `UPDATE rooms SET status = 'available' WHERE id = ?`,
      [booking.room_id]
    );

    await connection.commit();

    res.json({ 
      success: true, 
      message: "Booking cancelled successfully and room is now available",
      bookingId: bookingId
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Cancel booking error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error cancelling booking", 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});


// Fetching client's bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookings] = await db.execute(`
      SELECT 
        b.id,
        b.room_id,
        r.room_name,
        r.type,
        r.price,
        r.image_url,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.created_at
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json({ 
      success: true, 
      bookings 
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching bookings" 
    });
  }
});

export default router;
