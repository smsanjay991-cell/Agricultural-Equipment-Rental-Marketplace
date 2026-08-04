const { pool } = require('../config/db');

const formatBooking = (row) => {
  if (!row) return null;

  let parsedImages = [];
  try {
    if (typeof row.equipment_images === 'string') {
      parsedImages = JSON.parse(row.equipment_images);
    } else if (Array.isArray(row.equipment_images)) {
      parsedImages = row.equipment_images;
    }
  } catch (e) {
    parsedImages = [];
  }

  const bookingObj = {
    _id: row.id,
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    totalDays: row.total_days,
    dailyRate: Number(row.daily_rate),
    includeDriver: Boolean(row.include_driver),
    driverCost: Number(row.driver_cost),
    totalPrice: Number(row.total_price),
    status: row.status,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.equipment_id) {
    bookingObj.equipment = {
      _id: row.equipment_id,
      id: row.equipment_id,
      name: row.equipment_name || '',
      category: row.equipment_category || '',
      images: parsedImages,
      location: row.equipment_location || '',
      dailyRate: Number(row.equipment_daily_rate || 0)
    };

    if (row.owner_id) {
      bookingObj.equipment.owner = {
        _id: row.owner_id,
        id: row.owner_id,
        name: row.owner_name || '',
        phone: row.owner_phone || '',
        location: row.owner_location || '',
        email: row.owner_email || ''
      };
    }
  }

  if (row.farmer_id) {
    bookingObj.farmer = {
      _id: row.farmer_id,
      id: row.farmer_id,
      name: row.farmer_name || '',
      phone: row.farmer_phone || '',
      email: row.farmer_email || '',
      location: row.farmer_location || ''
    };
  }

  return bookingObj;
};

const BASE_BOOKING_SELECT = `
  SELECT 
    b.*,
    e.name AS equipment_name,
    e.category AS equipment_category,
    e.images AS equipment_images,
    e.location AS equipment_location,
    e.daily_rate AS equipment_daily_rate,
    e.owner_id AS owner_id,
    u_owner.name AS owner_name,
    u_owner.phone AS owner_phone,
    u_owner.location AS owner_location,
    u_owner.email AS owner_email,
    u_farmer.id AS farmer_id,
    u_farmer.name AS farmer_name,
    u_farmer.phone AS farmer_phone,
    u_farmer.email AS farmer_email,
    u_farmer.location AS farmer_location
  FROM bookings b
  LEFT JOIN equipment e ON b.equipment_id = e.id
  LEFT JOIN users u_owner ON e.owner_id = u_owner.id
  LEFT JOIN users u_farmer ON b.farmer_id = u_farmer.id
`;

class BookingModel {
  static async create(data) {
    const {
      equipment,
      farmer,
      startDate,
      endDate,
      totalDays,
      dailyRate,
      includeDriver = false,
      driverCost = 0,
      totalPrice,
      notes = '',
      status = 'Pending'
    } = data;

    const equipmentId = typeof equipment === 'object' ? equipment._id || equipment.id : equipment;
    const farmerId = typeof farmer === 'object' ? farmer._id || farmer.id : farmer;

    const [result] = await pool.query(
      `INSERT INTO bookings 
        (equipment_id, farmer_id, start_date, end_date, total_days, daily_rate, include_driver, driver_cost, total_price, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        equipmentId,
        farmerId,
        startDate,
        endDate,
        totalDays,
        dailyRate,
        includeDriver ? 1 : 0,
        driverCost,
        totalPrice,
        notes,
        status
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const sql = `${BASE_BOOKING_SELECT} WHERE b.id = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) return null;
    return formatBooking(rows[0]);
  }

  static async findByFarmer(farmerId) {
    const sql = `${BASE_BOOKING_SELECT} WHERE b.farmer_id = ? ORDER BY b.created_at DESC`;
    const [rows] = await pool.query(sql, [farmerId]);
    return rows.map(formatBooking);
  }

  static async findByEquipmentIds(equipmentIds) {
    if (!equipmentIds || equipmentIds.length === 0) return [];
    const placeholders = equipmentIds.map(() => '?').join(',');
    const sql = `${BASE_BOOKING_SELECT} WHERE b.equipment_id IN (${placeholders}) ORDER BY b.created_at DESC`;
    const [rows] = await pool.query(sql, equipmentIds);
    return rows.map(formatBooking);
  }

  static async findOne(query) {
    let sql = `${BASE_BOOKING_SELECT} WHERE 1=1`;
    const params = [];

    if (query.equipment) {
      sql += ' AND b.equipment_id = ?';
      params.push(query.equipment);
    }

    if (query.status && query.status.$in) {
      const placeholders = query.status.$in.map(() => '?').join(',');
      sql += ` AND b.status IN (${placeholders})`;
      params.push(...query.status.$in);
    } else if (query.status) {
      sql += ' AND b.status = ?';
      params.push(query.status);
    }

    if (query._id && query._id.$ne) {
      sql += ' AND b.id != ?';
      params.push(query._id.$ne);
    }

    if (query.$or && Array.isArray(query.$or)) {
      // Handles overlapping dates: start_date <= end AND end_date >= start
      const dateCondition = query.$or[0];
      if (dateCondition && dateCondition.startDate && dateCondition.endDate) {
        sql += ' AND b.start_date <= ? AND b.end_date >= ?';
        params.push(dateCondition.startDate.$lte, dateCondition.endDate.$gte);
      }
    }

    sql += ' LIMIT 1';

    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) return null;
    return formatBooking(rows[0]);
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
}

module.exports = BookingModel;
