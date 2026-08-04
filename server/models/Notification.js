const { pool } = require('../config/db');

class NotificationModel {
  static async create(userId, title, message) {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [userId, title, message]
    );
    return { id: result.insertId, userId, title, message, isRead: false };
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
}

module.exports = NotificationModel;
