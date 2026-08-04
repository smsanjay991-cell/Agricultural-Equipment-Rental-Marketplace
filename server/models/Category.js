const { pool } = require('../config/db');

class CategoryModel {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows.map(r => ({
      _id: r.id,
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  static async create(name, description = '') {
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)',
      [name, description]
    );
    return { id: result.insertId, name, description };
  }
}

module.exports = CategoryModel;
