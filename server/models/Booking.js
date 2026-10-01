const { pool } = require('../config/db');

/**
 * Formats raw MySQL row result into structured JSON object matching User & Equipment models.
 */
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

  const rawStatus = row.booking_status || row.status || 'pending';
  const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  const dailyRentVal = Number(row.daily_rent !== null && row.daily_rent !== undefined ? row.daily_rent : (row.daily_rate || 0));
  const totalAmountVal = Number(row.total_amount !== null && row.total_amount !== undefined ? row.total_amount : (row.total_price || 0));

  const bookingObj = {
    _id: row.id,
    id: row.id,
    equipment_id: row.equipment_id,
    equipmentId: row.equipment_id,
    farmer_id: row.farmer_id,
    farmerId: row.farmer_id,
    owner_id: row.owner_id,
    ownerId: row.owner_id,
    booking_date: row.booking_date || row.created_at,
    bookingDate: row.booking_date || row.created_at,
    start_date: row.start_date,
    startDate: row.start_date,
    end_date: row.end_date,
    endDate: row.end_date,
    total_days: row.total_days,
    totalDays: row.total_days,
    daily_rent: dailyRentVal,
    dailyRent: dailyRentVal,
    daily_rate: dailyRentVal,
    dailyRate: dailyRentVal,
    include_driver: Boolean(row.include_driver),
    includeDriver: Boolean(row.include_driver),
    driver_cost: Number(row.driver_cost || 0),
    driverCost: Number(row.driver_cost || 0),
    total_amount: totalAmountVal,
    totalAmount: totalAmountVal,
    total_price: totalAmountVal,
    totalPrice: totalAmountVal,
    deposit_amount: Number(row.deposit_amount || 0),
    depositAmount: Number(row.deposit_amount || 0),
    booking_status: rawStatus.toLowerCase(),
    bookingStatus: rawStatus.toLowerCase(),
    status: normalizedStatus,
    payment_status: row.payment_status || 'pending',
    paymentStatus: row.payment_status || 'pending',
    remarks: row.remarks || row.notes || '',
    notes: row.notes || row.remarks || '',
    created_at: row.created_at,
    createdAt: row.created_at,
    updated_at: row.updated_at,
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
      dailyRate: Number(row.equipment_daily_rate || 0),
      dailyRent: Number(row.equipment_daily_rate || 0)
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
    u_owner.id AS owner_id,
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
  LEFT JOIN users u_owner ON (b.owner_id = u_owner.id OR e.owner_id = u_owner.id)
  LEFT JOIN users u_farmer ON b.farmer_id = u_farmer.id
`;

class BookingModel {
  /**
   * Creates a new booking record in MySQL
   */
  static async create(data) {
    try {
      const {
        equipment,
        equipmentId: reqEqId,
        farmer,
        farmerId: reqFarmerId,
        ownerId: reqOwnerId,
        startDate,
        start_date,
        endDate,
        end_date,
        totalDays,
        total_days,
        dailyRent,
        daily_rent,
        dailyRate,
        daily_rate,
        includeDriver = false,
        include_driver = false,
        driverCost = 0,
        driver_cost = 0,
        totalAmount,
        total_amount,
        totalPrice,
        total_price,
        depositAmount = 0,
        deposit_amount = 0,
        notes = '',
        remarks = '',
        bookingStatus = 'pending',
        booking_status = 'pending',
        status = 'Pending',
        paymentStatus = 'pending',
        payment_status = 'pending'
      } = data;

      const equipmentId = reqEqId || (typeof equipment === 'object' ? equipment._id || equipment.id : equipment);
      const farmerId = reqFarmerId || (typeof farmer === 'object' ? farmer._id || farmer.id : farmer);
      
      let ownerId = reqOwnerId || data.owner_id;
      if (!ownerId && equipmentId) {
        const [eqRows] = await pool.query('SELECT owner_id FROM equipment WHERE id = ?', [equipmentId]);
        if (eqRows.length > 0) {
          ownerId = eqRows[0].owner_id;
        }
      }

      const sDate = startDate || start_date;
      const eDate = endDate || end_date;
      const days = totalDays || total_days || 1;
      const rate = dailyRent || daily_rent || dailyRate || daily_rate || 0;
      const incDriver = includeDriver || include_driver ? 1 : 0;
      const dCost = driverCost || driver_cost || 0;
      const total = totalAmount || total_amount || totalPrice || total_price || 0;
      const depAmount = depositAmount || deposit_amount || 0;
      const remText = remarks || notes || '';
      const bStatus = (bookingStatus || booking_status || status || 'pending').toLowerCase();
      const capStatus = bStatus.charAt(0).toUpperCase() + bStatus.slice(1);
      const pStatus = paymentStatus || payment_status || 'pending';

      const [result] = await pool.query(
        `INSERT INTO bookings 
          (equipment_id, farmer_id, owner_id, start_date, end_date, total_days, daily_rent, daily_rate, include_driver, driver_cost, total_amount, total_price, deposit_amount, booking_status, status, payment_status, remarks, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          equipmentId,
          farmerId,
          ownerId,
          sDate,
          eDate,
          days,
          rate,
          rate,
          incDriver,
          dCost,
          total,
          total,
          depAmount,
          bStatus,
          capStatus,
          pStatus,
          remText,
          remText
        ]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      console.error(`❌ BookingModel.create error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches all bookings matching optional filter criteria
   */
  static async findAll(filters = {}) {
    try {
      let sql = `${BASE_BOOKING_SELECT} WHERE 1=1`;
      const params = [];

      if (filters.farmerId || filters.farmer_id || filters.farmer) {
        sql += ' AND b.farmer_id = ?';
        params.push(filters.farmerId || filters.farmer_id || filters.farmer);
      }

      if (filters.ownerId || filters.owner_id || filters.owner) {
        sql += ' AND (b.owner_id = ? OR e.owner_id = ?)';
        const oId = filters.ownerId || filters.owner_id || filters.owner;
        params.push(oId, oId);
      }

      if (filters.equipmentId || filters.equipment_id || filters.equipment) {
        sql += ' AND b.equipment_id = ?';
        params.push(filters.equipmentId || filters.equipment_id || filters.equipment);
      }

      if (filters.status) {
        sql += ' AND (b.booking_status = ? OR b.status = ?)';
        params.push(filters.status.toLowerCase(), filters.status);
      }

      if (filters.paymentStatus || filters.payment_status) {
        sql += ' AND b.payment_status = ?';
        params.push(filters.paymentStatus || filters.payment_status);
      }

      sql += ' ORDER BY b.created_at DESC';

      const [rows] = await pool.query(sql, params);
      return rows.map(formatBooking);
    } catch (error) {
      console.error(`❌ BookingModel.findAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches single booking by Primary Key ID
   */
  static async findById(id) {
    try {
      const sql = `${BASE_BOOKING_SELECT} WHERE b.id = ? LIMIT 1`;
      const [rows] = await pool.query(sql, [id]);
      if (rows.length === 0) return null;
      return formatBooking(rows[0]);
    } catch (error) {
      console.error(`❌ BookingModel.findById error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches all bookings created by a specific farmer
   */
  static async findByFarmer(farmerId) {
    return await this.findAll({ farmer_id: farmerId });
  }

  /**
   * Fetches all bookings received by an equipment owner
   */
  static async findByOwner(ownerId) {
    return await this.findAll({ owner_id: ownerId });
  }

  /**
   * Updates booking status and optional payment status
   */
  static async updateStatus(id, status, paymentStatus = null) {
    try {
      const existing = await this.findById(id);
      if (!existing) return null;

      const normBookingStatus = status.toLowerCase();
      const normStatus = normBookingStatus.charAt(0).toUpperCase() + normBookingStatus.slice(1);

      if (paymentStatus) {
        await pool.query(
          'UPDATE bookings SET booking_status = ?, status = ?, payment_status = ? WHERE id = ?',
          [normBookingStatus, normStatus, paymentStatus, id]
        );
      } else {
        await pool.query(
          'UPDATE bookings SET booking_status = ?, status = ? WHERE id = ?',
          [normBookingStatus, normStatus, id]
        );
      }

      return await this.findById(id);
    } catch (error) {
      console.error(`❌ BookingModel.updateStatus error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancels a booking record if user is authorized (Farmer, Owner, or Admin)
   */
  static async cancelBooking(id, userId = null) {
    try {
      const existing = await this.findById(id);
      if (!existing) return null;

      if (userId) {
        const uId = userId.toString();
        const isFarmer = existing.farmerId && existing.farmerId.toString() === uId;
        const isOwner = existing.ownerId && existing.ownerId.toString() === uId;
        if (!isFarmer && !isOwner) {
          throw new Error('Not authorized to cancel this booking');
        }
      }

      await pool.query(
        'UPDATE bookings SET booking_status = ?, status = ? WHERE id = ?',
        ['cancelled', 'Cancelled', id]
      );

      return await this.findById(id);
    } catch (error) {
      console.error(`❌ BookingModel.cancelBooking error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deletes a booking record from MySQL
   */
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`❌ BookingModel.delete error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper method to query multi-equipment bookings for an owner
   */
  static async findByEquipmentIds(equipmentIds) {
    try {
      if (!equipmentIds || equipmentIds.length === 0) return [];
      const placeholders = equipmentIds.map(() => '?').join(',');
      const sql = `${BASE_BOOKING_SELECT} WHERE b.equipment_id IN (${placeholders}) ORDER BY b.created_at DESC`;
      const [rows] = await pool.query(sql, equipmentIds);
      return rows.map(formatBooking);
    } catch (error) {
      console.error(`❌ BookingModel.findByEquipmentIds error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper method for date overlap validation queries
   */
  static async findOne(query) {
    try {
      let sql = `${BASE_BOOKING_SELECT} WHERE 1=1`;
      const params = [];

      if (query.equipment) {
        sql += ' AND b.equipment_id = ?';
        params.push(query.equipment);
      }

      if (query.status && query.status.$in) {
        const placeholders = query.status.$in.map(() => '?').join(',');
        sql += ` AND (b.booking_status IN (${placeholders}) OR b.status IN (${placeholders}))`;
        params.push(...query.status.$in, ...query.status.$in);
      } else if (query.status) {
        sql += ' AND (b.booking_status = ? OR b.status = ?)';
        params.push(query.status.toLowerCase(), query.status);
      }

      if (query._id && query._id.$ne) {
        sql += ' AND b.id != ?';
        params.push(query._id.$ne);
      }

      if (query.$or && Array.isArray(query.$or)) {
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
    } catch (error) {
      console.error(`❌ BookingModel.findOne error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = BookingModel;
