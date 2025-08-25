const userModel = require('../models/user.models');
const blacklisttokenModel = require('../models/blacklisttoken.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hash });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        delete newUser._doc.password;

        res.send({ token, newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user._doc.password;

        res.cookie('token', token);

        res.send({ token, user });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}

module.exports.logout = async (req, res) => {
    try {
        console.log('🔍 req.cookies:', req.cookies);
        console.log('🔍 req.headers.authorization:', req.headers['authorization']);

        const cookieToken = req.cookies?.token;
        const headerToken = req.headers['authorization']?.startsWith('Bearer ')
            ? req.headers['authorization'].split(' ')[1]
            : null;

        const token = cookieToken || headerToken;

        if (!token) {
            return res.status(400).json({ message: 'No token found in cookies or Authorization header.' });
        }

        console.log('🪙 Token being blacklisted:', token);

        await blacklisttokenModel.create({ token });

        res.clearCookie('token');
        res.json({ message: 'User logged out successfully' });

    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ message: error.message });
    }
};


module.exports.profile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}