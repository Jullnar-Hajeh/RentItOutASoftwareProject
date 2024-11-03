const jwt = require('jsonwebtoken');
const JWT_SECRET = '2003'; // Ensure this matches the sign-in function

// Middleware for checking the JWT token to make sure that user is logged in
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. Token missing.' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err.message);
                return res.status(403).json({ error: 'Token is not valid', details: err.message });
            }

            req.user = decoded; 
            next();
        });
    } else {
        res.status(401).json({ error: 'Access denied. No token provided.' });
    }
};

module.exports = verifyToken;
