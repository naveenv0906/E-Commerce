const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).send('Email already in use. Please use a different email.');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const customer = new Customer({ name, email, password: hashedPassword });
        await customer.save();
        res.redirect('/customer-login'); // Redirect to login after registration
    } catch (err) {
        console.error(err);
        res.status(400).send('Error creating account');
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        // Use trimmed email for lookup
        const customer = await Customer.findOne({ email: new RegExp('^' + email.trim() + '$', 'i') });

        if (!customer) {
            return res.status(401).send('Email does not exist');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).send('Incorrect password');
        }

        // Create and set token in session
        const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;

        res.redirect('/'); // Redirect to home after login
    } catch (err) {
        console.error(err);
        res.status(400).send('Error logging in');
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/customer-login'); // Redirect to login page after logout
    });
};

// Reset Password - Request Token
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        console.log(`Reset password request received for email: ${email}`);

        const customer = await Customer.findOne({ email });
        if (!customer) {
            console.log('Customer not found');
            return res.status(404).send('Customer not found');
        }

        console.log('Customer found:', customer.email);

        const token = crypto.randomBytes(32).toString('hex');
        customer.resetToken = token;
        customer.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

        await customer.save();
        console.log('Token saved:', token);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log('Sending email...');

        await transporter.sendMail({
            to: customer.email,
            from: 'noreply@yourapp.com',
            subject: 'Password Reset',
            html: `<p>You requested a password reset.</p><p>Click this <a href="http://localhost:3000/customer-reset/${token}">link</a> to set a new password.</p>`
        });

        console.log('Email sent to:', customer.email);
        res.send('Password reset link sent to your email');
    } catch (err) {
        console.error('Error during password reset request:', err);
        res.status(500).send('Error requesting password reset');
    }
};


// Reset Password - Set New Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const customer = await Customer.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() } // Check if token is valid
        });

        if (!customer) return res.status(400).send('Invalid or expired token');

        const hashedPassword = await bcrypt.hash(password, 10); // Hash new password
        customer.password = hashedPassword;
        customer.resetToken = undefined; // Clear the token
        customer.resetTokenExpiration = undefined; // Clear the expiration
        await customer.save();

        res.redirect('/customer-login'); // Redirect to login after password reset
    } catch (err) {
        console.error(err);
        res.status(500).send('Error resetting password');
    }
};
