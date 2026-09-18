const { pool } = require('../config/db');

const formatCategory = (r) => {
  if (!r) return null;
  return {
    _id: r.id,
    id: r.id,
    name: r.name,
    description: r.description || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
};

class CategoryModel {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows.map(formatCategory);
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    return formatCategory(rows[0]);
  }

  static async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1', [name]);
    if (rows.length === 0) return null;
    return formatCategory(rows[0]);
  }

  static async create(nameOrObj, description = '') {
    let name = nameOrObj;
    let desc = description;

    if (nameOrObj && typeof nameOrObj === 'object') {
      name = nameOrObj.name;
      desc = nameOrObj.description || '';
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)',
      [name, desc]
    );
    const catId = result.insertId || (await this.findByName(name))?.id;
    return this.findById(catId);
  }

  static async update(id, { name, description }) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedName = name !== undefined ? name : existing.name;
    const updatedDesc = description !== undefined ? description : existing.description;

    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [updatedName, updatedDesc, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = CategoryModel;
