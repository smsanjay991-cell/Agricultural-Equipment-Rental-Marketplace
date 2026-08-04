const { pool } = require('../config/db');

const formatReview = (row) => {
  if (!row) return null;
  const reviewObj = {
    _id: row.id,
    id: row.id,
    equipment: row.equipment_id,
    booking: row.booking_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.farmer_id) {
    reviewObj.farmer = {
      _id: row.farmer_id,
      id: row.farmer_id,
      name: row.farmer_name || '',
      avatar: row.farmer_avatar || ''
    };
  }

  return reviewObj;
};

class ReviewModel {
  static async find(query = {}) {
    let sql = `
      SELECT 
        r.*,
        u.name AS farmer_name,
        u.avatar AS farmer_avatar
      FROM reviews r
      LEFT JOIN users u ON r.farmer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (query.equipment) {
      sql += ' AND r.equipment_id = ?';
      params.push(query.equipment);
    }

    if (query.farmer) {
      sql += ' AND r.farmer_id = ?';
      params.push(query.farmer);
    }

    sql += ' ORDER BY r.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows.map(formatReview);
  }

  static async create(data) {
    const { equipment, farmer, booking, rating, comment } = data;
    const equipmentId = typeof equipment === 'object' ? equipment._id || equipment.id : equipment;
    const farmerId = typeof farmer === 'object' ? farmer._id || farmer.id : farmer;
    const bookingId = typeof booking === 'object' ? booking._id || booking.id : booking;

    const [result] = await pool.query(
      'INSERT INTO reviews (equipment_id, farmer_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [equipmentId, farmerId, bookingId, rating, comment]
    );

    // Update equipment average rating and review count
    const [stats] = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE equipment_id = ?',
      [equipmentId]
    );

    if (stats.length > 0) {
      const avg = Number(stats[0].avg_rating || 0).toFixed(2);
      const count = Number(stats[0].count || 0);
      await pool.query(
        'UPDATE equipment SET average_rating = ?, num_reviews = ? WHERE id = ?',
        [avg, count, equipmentId]
      );
    }

    const [newReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    return formatReview(newReview[0]);
  }
}

module.exports = ReviewModel;
