const jwt = require('jsonwebtoken');

// Middleware for checking the JWT token to make sure that user is logged in
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        // Use the correct secret key for verification
        jwt.verify(token, '2003', (err, user) => { // Change '1234' to '2003'
            if (err) {
                return res.status(403).json({ error: 'Token is not valid' });
            }
            req.user = user; // Attach the user information to the request
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.status(401).json({ error: 'Access denied. No token provided.' });
    }
};

module.exports = verifyToken;
