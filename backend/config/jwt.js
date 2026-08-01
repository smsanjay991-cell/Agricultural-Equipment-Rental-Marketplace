module.exports = {
  secret: process.env.JWT_SECRET || 'agrirent_secure_secret_key_2026',
  expire: process.env.JWT_EXPIRE || '30d'
};
