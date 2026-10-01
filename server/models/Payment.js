const { pool } = require('../config/db');

const formatPayment = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    booking_id: row.booking_id,
    bookingId: row.booking_id,
    farmer_id: row.farmer_id,
    farmerId: row.farmer_id,
    amount: Number(row.amount || 0),
    payment_status: row.payment_status || 'Pending',
    paymentStatus: row.payment_status || 'Pending',
    payment_method: row.payment_method || 'Cash/Manual',
    paymentMethod: row.payment_method || 'Cash/Manual',
    transaction_id: row.transaction_id || '',
    transactionId: row.transaction_id || '',
    created_at: row.created_at,
    createdAt: row.created_at,
    updated_at: row.updated_at,
    updatedAt: row.updated_at
  };
};

class PaymentModel {
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    return formatPayment(rows[0]);
  }

  static async findByBooking(bookingId) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC', [bookingId]);
    return rows.map(formatPayment);
  }

  static async findByFarmer(farmerId) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE farmer_id = ? ORDER BY created_at DESC', [farmerId]);
    return rows.map(formatPayment);
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    return rows.map(formatPayment);
  }

  static async create({ bookingId, booking_id, farmerId, farmer_id, amount, paymentStatus = 'Pending', payment_status, paymentMethod = 'Cash/Manual', payment_method, transactionId = null, transaction_id }) {
    const bId = bookingId || booking_id;
    const fId = farmerId || farmer_id;
    const pStatus = paymentStatus || payment_status || 'Pending';
    const pMethod = paymentMethod || payment_method || 'Cash/Manual';
    const txnId = transactionId || transaction_id || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const [result] = await pool.query(
      `INSERT INTO payments (booking_id, farmer_id, amount, payment_status, payment_method, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bId, fId, amount, pStatus, pMethod, txnId]
    );

    // Sync booking payment_status if completed
    if (pStatus.toLowerCase() === 'completed') {
      await pool.query(
        "UPDATE bookings SET payment_status = 'paid' WHERE id = ?",
        [bId]
      );
    }

    return this.findById(result.insertId);
  }

  static async updateStatus(id, paymentStatus) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await pool.query(
      'UPDATE payments SET payment_status = ? WHERE id = ?',
      [paymentStatus, id]
    );

    // Sync booking payment_status
    const normPStatus = paymentStatus.toLowerCase();
    const bookingPaymentStatus = normPStatus === 'completed' ? 'paid' : (normPStatus === 'refunded' ? 'refunded' : 'pending');
    
    await pool.query(
      'UPDATE bookings SET payment_status = ? WHERE id = ?',
      [bookingPaymentStatus, existing.bookingId]
    );

    return this.findById(id);
  }
}

module.exports = PaymentModel;
