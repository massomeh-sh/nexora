const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
    const token = req.cookies?.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
            req.user = undefined;
        }
    }

    next();
};

module.exports = optionalAuth;