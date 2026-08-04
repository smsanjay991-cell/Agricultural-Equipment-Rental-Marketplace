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

  const primaryImage = row.image || (parsedImages.length > 0 ? parsedImages[0] : '');
  if (parsedImages.length === 0 && primaryImage) {
    parsedImages = [primaryImage];
  }

  const dailyRentVal = row.daily_rent !== null && row.daily_rent !== undefined ? Number(row.daily_rent) : Number(row.daily_rate || 0);
  const dailyRateVal = row.daily_rate !== null && row.daily_rate !== undefined ? Number(row.daily_rate) : dailyRentVal;
  const isAvailVal = row.availability !== null && row.availability !== undefined ? Boolean(row.availability) : Boolean(row.is_available);

  const equipmentObj = {
    _id: row.id,
    id: row.id,
    owner_id: row.owner_id,
    ownerId: row.owner_id,
    category_id: row.category_id,
    categoryId: row.category_id,
    name: row.name,
    category: row.category || 'General',
    description: row.description,
    brand: row.brand || '',
    model: row.model || '',
    daily_rent: dailyRentVal,
    dailyRent: dailyRentVal,
    dailyRate: dailyRateVal,
    daily_rate: dailyRateVal,
    deposit: Number(row.deposit || 0),
    availability: isAvailVal,
    isAvailable: isAvailVal,
    is_available: isAvailVal,
    location: row.location,
    image: primaryImage,
    horsepower: row.horsepower || 0,
    fuelType: row.fuel_type || 'Diesel',
    fuel_type: row.fuel_type || 'Diesel',
    isDriverAvailable: Boolean(row.is_driver_available),
    is_driver_available: Boolean(row.is_driver_available),
    driverRatePerDay: Number(row.driver_rate_per_day || 0),
    driver_rate_per_day: Number(row.driver_rate_per_day || 0),
    images: parsedImages,
    averageRating: Number(row.average_rating || 0),
    average_rating: Number(row.average_rating || 0),
    numReviews: Number(row.num_reviews || 0),
    num_reviews: Number(row.num_reviews || 0),
    createdAt: row.created_at,
    created_at: row.created_at,
    updatedAt: row.updated_at,
    updated_at: row.updated_at
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
  static async findAll(filters = {}) {
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

    if (filters.owner || filters.owner_id || filters.ownerId) {
      sql += ' AND e.owner_id = ?';
      params.push(filters.owner || filters.owner_id || filters.ownerId);
    }

    if (filters.category_id || filters.categoryId) {
      sql += ' AND e.category_id = ?';
      params.push(filters.category_id || filters.categoryId);
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
      sql += ' AND (LOWER(e.name) LIKE ? OR LOWER(e.description) LIKE ? OR LOWER(e.category) LIKE ? OR LOWER(e.brand) LIKE ? OR LOWER(e.model) LIKE ?)';
      const term = `%${filters.search.toLowerCase()}%`;
      params.push(term, term, term, term, term);
    }

    if (filters.minPrice !== undefined) {
      sql += ' AND (e.daily_rent >= ? OR e.daily_rate >= ?)';
      params.push(Number(filters.minPrice), Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      sql += ' AND (e.daily_rent <= ? OR e.daily_rate <= ?)';
      params.push(Number(filters.maxPrice), Number(filters.maxPrice));
    }

    if (filters.isDriverAvailable === true || filters.isDriverAvailable === 'true') {
      sql += ' AND e.is_driver_available = 1';
    }

    sql += ' ORDER BY e.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows.map(formatEquipment);
  }

  static async find(filters = {}) {
    return this.findAll(filters);
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

  static async findByOwner(ownerId) {
    return this.findAll({ owner: ownerId });
  }

  static async create(data) {
    const ownerId = data.owner_id || data.ownerId || (typeof data.owner === 'object' ? (data.owner._id || data.owner.id) : data.owner);
    const categoryId = data.category_id || data.categoryId || null;
    const name = data.name;
    const categoryName = data.category || 'General';
    const description = data.description || '';
    const brand = data.brand || '';
    const model = data.model || '';
    const dailyRent = data.daily_rent !== undefined ? data.daily_rent : (data.dailyRent !== undefined ? data.dailyRent : (data.dailyRate !== undefined ? data.dailyRate : 0));
    const dailyRate = data.dailyRate !== undefined ? data.dailyRate : (data.daily_rent !== undefined ? data.daily_rent : dailyRent);
    const deposit = data.deposit !== undefined ? data.deposit : 0;
    const availability = data.availability !== undefined ? (data.availability ? 1 : 0) : (data.isAvailable !== undefined ? (data.isAvailable ? 1 : 0) : 1);
    const location = data.location || '';
    const image = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
    const horsepower = data.horsepower || 0;
    const fuelType = data.fuel_type || data.fuelType || 'Diesel';
    const isDriverAvailable = data.is_driver_available !== undefined ? (data.is_driver_available ? 1 : 0) : (data.isDriverAvailable ? 1 : 0);
    const driverRatePerDay = data.driver_rate_per_day !== undefined ? data.driver_rate_per_day : (data.driverRatePerDay || 0);

    let imagesArr = Array.isArray(data.images) ? data.images : [];
    if (imagesArr.length === 0 && image) {
      imagesArr = [image];
    }
    const imagesJson = JSON.stringify(imagesArr);

    const [result] = await pool.query(
      `INSERT INTO equipment 
        (owner_id, category_id, name, category, description, brand, model, daily_rent, deposit, availability, daily_rate, location, image, horsepower, fuel_type, is_driver_available, driver_rate_per_day, is_available, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerId,
        categoryId,
        name,
        categoryName,
        description,
        brand,
        model,
        dailyRent,
        deposit,
        availability,
        dailyRate,
        location,
        image,
        horsepower,
        fuelType,
        isDriverAvailable,
        driverRatePerDay,
        availability,
        imagesJson
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const ownerId = data.owner_id || data.ownerId || (data.owner ? (typeof data.owner === 'object' ? data.owner._id || data.owner.id : data.owner) : existing.ownerId);
    const categoryId = data.category_id !== undefined ? data.category_id : (data.categoryId !== undefined ? data.categoryId : existing.categoryId);
    const name = data.name !== undefined ? data.name : existing.name;
    const categoryName = data.category !== undefined ? data.category : existing.category;
    const description = data.description !== undefined ? data.description : existing.description;
    const brand = data.brand !== undefined ? data.brand : existing.brand;
    const model = data.model !== undefined ? data.model : existing.model;
    const dailyRent = data.daily_rent !== undefined ? data.daily_rent : (data.dailyRent !== undefined ? data.dailyRent : existing.dailyRent);
    const dailyRate = data.dailyRate !== undefined ? data.dailyRate : (data.daily_rate !== undefined ? data.daily_rate : existing.dailyRate);
    const deposit = data.deposit !== undefined ? data.deposit : existing.deposit;
    const availability = data.availability !== undefined ? (data.availability ? 1 : 0) : (data.isAvailable !== undefined ? (data.isAvailable ? 1 : 0) : (existing.availability ? 1 : 0));
    const location = data.location !== undefined ? data.location : existing.location;
    const image = data.image !== undefined ? data.image : existing.image;
    const horsepower = data.horsepower !== undefined ? data.horsepower : existing.horsepower;
    const fuelType = data.fuel_type || data.fuelType || existing.fuelType;
    const isDriverAvailable = data.is_driver_available !== undefined ? (data.is_driver_available ? 1 : 0) : (data.isDriverAvailable !== undefined ? (data.isDriverAvailable ? 1 : 0) : (existing.isDriverAvailable ? 1 : 0));
    const driverRatePerDay = data.driver_rate_per_day !== undefined ? data.driver_rate_per_day : (data.driverRatePerDay !== undefined ? data.driverRatePerDay : existing.driverRatePerDay);

    let imagesArr = data.images !== undefined ? (Array.isArray(data.images) ? data.images : [data.images]) : existing.images;
    if (imagesArr.length === 0 && image) {
      imagesArr = [image];
    }
    const imagesJson = JSON.stringify(imagesArr);

    await pool.query(
      `UPDATE equipment SET 
        owner_id = ?, category_id = ?, name = ?, category = ?, description = ?, brand = ?, model = ?,
        daily_rent = ?, deposit = ?, availability = ?, daily_rate = ?, location = ?, image = ?,
        horsepower = ?, fuel_type = ?, is_driver_available = ?, driver_rate_per_day = ?, 
        is_available = ?, images = ?
       WHERE id = ?`,
      [
        ownerId,
        categoryId,
        name,
        categoryName,
        description,
        brand,
        model,
        dailyRent,
        deposit,
        availability,
        dailyRate,
        location,
        image,
        horsepower,
        fuelType,
        isDriverAvailable,
        driverRatePerDay,
        availability,
        imagesJson,
        id
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    return this.delete(id);
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
