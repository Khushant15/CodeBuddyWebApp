const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });
    console.log(`[AUTH] Admin Check: UID=${req.user.uid}, Found=${!!user}, Role=${user?.role}`);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = adminMiddleware;
