// backend/middleware/authorizeRole.js

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Assumes req.user is set by authentication middleware
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: Unauthorized role" });
      }
  
      next();
    };
  };
  
  module.exports = {authorizeRole}
