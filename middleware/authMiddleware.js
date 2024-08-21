const jwt = require('jsonwebtoken');

exports.isUser = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login');
        req.customerId = decoded.customerId;
        next();
    });
};