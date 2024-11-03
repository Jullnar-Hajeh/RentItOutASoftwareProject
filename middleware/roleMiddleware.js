// roleMiddleware.js
const verifyToken = require('./authMiddleware'); 

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      const { role } = req.user; 

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: 'Access denied. You do not have the required permissions.' });
      }

      next(); 
    });
  };
};

module.exports = roleMiddleware;

