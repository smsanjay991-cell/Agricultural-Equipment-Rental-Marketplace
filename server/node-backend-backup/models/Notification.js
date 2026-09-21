const { pool } = require('../config/db');

class NotificationModel {
  static formatNotification(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      user_id: row.user_id,
      title: row.title,
      message: row.message,
      isRead: Boolean(row.is_read),
      is_read: row.is_read,
      createdAt: row.created_at,
      created_at: row.created_at,
      updatedAt: row.updated_at,
      updated_at: row.updated_at
    };
  }

  static async create(userId, title, message) {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [userId, title, message]
    );
    return {
      id: result.insertId,
      userId: Number(userId),
      user_id: Number(userId),
      title,
      message,
      isRead: false,
      is_read: 0,
      createdAt: new Date().toISOString()
    };
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(r => this.formatNotification(r));
  }

  static async countUnread(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return rows[0]?.unread_count || 0;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? this.formatNotification(rows[0]) : null;
  }

  static async markAsRead(id, userId) {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return this.findById(id);
  }

  static async markAllAsRead(userId) {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return { affectedRows: result.affectedRows };
  }
}

module.exports = NotificationModel;
