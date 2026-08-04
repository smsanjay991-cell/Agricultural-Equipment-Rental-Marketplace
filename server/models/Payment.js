const { pool } = require('../config/db');

class PaymentModel {
  static async create({ bookingId, farmerId, amount, paymentStatus = 'Pending', paymentMethod = 'Cash/Manual', transactionId = null }) {
    const [result] = await pool.query(
      `INSERT INTO payments (booking_id, farmer_id, amount, payment_status, payment_method, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingId, farmerId, amount, paymentStatus, paymentMethod, transactionId]
    );
    return {
      _id: result.insertId,
      id: result.insertId,
      bookingId,
      farmerId,
      amount,
      paymentStatus,
      paymentMethod,
      transactionId
    };
  }

  static async findByBooking(bookingId) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
    return rows;
  }
}

module.exports = PaymentModel;
