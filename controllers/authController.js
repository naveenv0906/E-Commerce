const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error registering new user.');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('User not found.');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Invalid password.');
    }
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error logging in.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/login');
  });
};
