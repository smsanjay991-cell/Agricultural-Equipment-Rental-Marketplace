const { pool } = require('../config/db');

const formatEquipment = (row) => {
  if (!row) return null;

  let parsedImages = [];
  try {
    if (typeof row.images === 'string') {
      parsedImages = JSON.parse(row.images);
    } else if (Array.isArray(row.images)) {
      parsedImages = row.images;
    }
  } catch (e) {
    parsedImages = [];
  }

  const equipmentObj = {
    _id: row.id,
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    dailyRate: Number(row.daily_rate),
    location: row.location,
    horsepower: row.horsepower,
    fuelType: row.fuel_type,
    isDriverAvailable: Boolean(row.is_driver_available),
    driverRatePerDay: Number(row.driver_rate_per_day),
    isAvailable: Boolean(row.is_available),
    images: parsedImages,
    averageRating: Number(row.average_rating || 0),
    numReviews: Number(row.num_reviews || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.owner_id) {
    equipmentObj.owner = {
      _id: row.owner_id,
      id: row.owner_id,
      name: row.owner_name || '',
      phone: row.owner_phone || '',
      location: row.owner_location || '',
      email: row.owner_email || '',
      avatar: row.owner_avatar || ''
    };
  }

  return equipmentObj;
};

class EquipmentModel {
  static async find(filters = {}) {
    let sql = `
      SELECT 
        e.*,
        u.name AS owner_name,
        u.phone AS owner_phone,
        u.location AS owner_location,
        u.email AS owner_email,
        u.avatar AS owner_avatar
      FROM equipment e
      LEFT JOIN users u ON e.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.owner) {
      sql += ' AND e.owner_id = ?';
      params.push(filters.owner);
    }

    if (filters.category && filters.category !== 'All') {
      sql += ' AND e.category = ?';
      params.push(filters.category);
    }

    if (filters.location) {
      sql += ' AND LOWER(e.location) LIKE ?';
      params.push(`%${filters.location.toLowerCase()}%`);
    }

    if (filters.search) {
      sql += ' AND (LOWER(e.name) LIKE ? OR LOWER(e.description) LIKE ? OR LOWER(e.category) LIKE ?)';
      const term = `%${filters.search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    if (filters.minPrice !== undefined) {
      sql += ' AND e.daily_rate >= ?';
      params.push(Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      sql += ' AND e.daily_rate <= ?';
      params.push(Number(filters.maxPrice));
    }

    if (filters.isDriverAvailable === true || filters.isDriverAvailable === 'true') {
      sql += ' AND e.is_driver_available = 1';
    }

    sql += ' ORDER BY e.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows.map(formatEquipment);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        e.*,
        u.name AS owner_name,
        u.phone AS owner_phone,
        u.location AS owner_location,
        u.email AS owner_email,
        u.avatar AS owner_avatar
      FROM equipment e
      LEFT JOIN users u ON e.owner_id = u.id
      WHERE e.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) return null;
    return formatEquipment(rows[0]);
  }

  static async create(data) {
    const {
      owner,
      name,
      category,
      description,
      dailyRate,
      location,
      horsepower = 0,
      fuelType = 'Diesel',
      isDriverAvailable = false,
      driverRatePerDay = 0,
      images = []
    } = data;

    const ownerId = typeof owner === 'object' ? owner._id || owner.id : owner;
    const imagesJson = JSON.stringify(images);

    const [result] = await pool.query(
      `INSERT INTO equipment 
        (owner_id, name, category, description, daily_rate, location, horsepower, fuel_type, is_driver_available, driver_rate_per_day, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerId,
        name,
        category,
        description,
        dailyRate,
        location,
        horsepower,
        fuelType,
        isDriverAvailable ? 1 : 0,
        driverRatePerDay,
        imagesJson
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const ownerId = data.owner ? (typeof data.owner === 'object' ? data.owner._id || data.owner.id : data.owner) : existing.owner._id;
    const name = data.name !== undefined ? data.name : existing.name;
    const category = data.category !== undefined ? data.category : existing.category;
    const description = data.description !== undefined ? data.description : existing.description;
    const dailyRate = data.dailyRate !== undefined ? data.dailyRate : existing.dailyRate;
    const location = data.location !== undefined ? data.location : existing.location;
    const horsepower = data.horsepower !== undefined ? data.horsepower : existing.horsepower;
    const fuelType = data.fuelType !== undefined ? data.fuelType : existing.fuelType;
    const isDriverAvailable = data.isDriverAvailable !== undefined ? data.isDriverAvailable : existing.isDriverAvailable;
    const driverRatePerDay = data.driverRatePerDay !== undefined ? data.driverRatePerDay : existing.driverRatePerDay;
    const isAvailable = data.isAvailable !== undefined ? data.isAvailable : existing.isAvailable;
    const imagesJson = data.images !== undefined ? JSON.stringify(data.images) : JSON.stringify(existing.images);

    await pool.query(
      `UPDATE equipment SET 
        owner_id = ?, name = ?, category = ?, description = ?, daily_rate = ?, location = ?, 
        horsepower = ?, fuel_type = ?, is_driver_available = ?, driver_rate_per_day = ?, 
        is_available = ?, images = ?
       WHERE id = ?`,
      [
        ownerId,
        name,
        category,
        description,
        dailyRate,
        location,
        horsepower,
        fuelType,
        isDriverAvailable ? 1 : 0,
        driverRatePerDay,
        isAvailable ? 1 : 0,
        imagesJson,
        id
      ]
    );

    return this.findById(id);
  }

  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deleteMany() {
    await pool.query('DELETE FROM equipment');
  }

  static async insertMany(items) {
    for (const item of items) {
      await this.create(item);
    }
  }
}

module.exports = EquipmentModel;
