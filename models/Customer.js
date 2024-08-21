const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date }
});

customerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

customerSchema.methods.isPasswordValid = function(password) {
    return bcrypt.compare(password, this.password);
};

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
