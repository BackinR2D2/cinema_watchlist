const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

async function login (req, res, next) {
    try {
        let {email, password} = req.body;
        password = password.toString();
        await schema.validateAsync({ email, password });
        const user = await db('user_info').where({email});
        if (!user.length) {
            throw new Error('Invalid email');
        }
        const isValid = await bcrypt.compare(password, user[0].password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        await db('user_info').where({email}).update({last_login: new Date().toLocaleDateString('en-GB')});
        const token = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.status(200).json({
            status: 1,
            token
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}

module.exports = login;