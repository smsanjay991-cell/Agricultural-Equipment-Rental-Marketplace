const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const formatUser = (user) => {
  if (!user) return null;
  const { id, password, created_at, updated_at, ...rest } = user;
  return {
    _id: id,
    id: id,
    ...rest,
    password: password, // preserved if queried
    createdAt: created_at,
    updatedAt: updated_at
  };
};

class UserModel {
  static async findByEmail(email, includePassword = false) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );
    if (rows.length === 0) return null;
    const formatted = formatUser(rows[0]);
    if (!includePassword) {
      delete formatted.password;
    }
    return formatted;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, location, avatar, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return formatUser(rows[0]);
  }

  static async create({ name, email, password, phone, role = 'farmer', location = '', avatar = '' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role, location, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword, phone, role, location, avatar]
    );

    return this.findById(result.insertId);
  }

  static async updateProfile(id, { name, email, phone, location, avatar, password }) {
    const currentUser = await this.findById(id);
    if (!currentUser) return null;

    const updatedName = name || currentUser.name;
    const updatedEmail = email ? email.toLowerCase() : currentUser.email;
    const updatedPhone = phone || currentUser.phone;
    const updatedLocation = location !== undefined ? location : currentUser.location;
    const updatedAvatar = avatar !== undefined ? avatar : currentUser.avatar;

    let updatedPassword = null;
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    if (updatedPassword) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ?, phone = ?, location = ?, avatar = ? WHERE id = ?',
        [updatedName, updatedEmail, updatedPassword, updatedPhone, updatedLocation, updatedAvatar, id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, location = ?, avatar = ? WHERE id = ?',
        [updatedName, updatedEmail, updatedPhone, updatedLocation, updatedAvatar, id]
      );
    }

    return this.findById(id);
  }

  static async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, location, avatar, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return rows.map(formatUser);
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = UserModel;
