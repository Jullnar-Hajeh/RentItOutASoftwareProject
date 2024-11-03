// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role === 'Admin') {
        return next(); // Proceed if the user is an Admin
    }
    return res.status(403).json({ msg: "Access denied. Admins only." });
};

module.exports = isAdmin;
