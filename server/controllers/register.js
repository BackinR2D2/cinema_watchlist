const sendMail = require('../helpers/sendMail');
const generateCode = require('../helpers/generateCode');
const Joi = require('joi');
const db = require('../db');
const hashPassword = require('../helpers/hashPassword');
let generatedCode = null;

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

async function verify (req, res, next) {
    try {
        const code = generateCode();
        let { email, password } = req.body;
        password = password.toString();
        await schema.validateAsync({ email, password });

        const user = await db('user_info').where({email}).first();
        if(user) {
            res.status(400).json({
                status: 0,
                message: 'User already exists'
            });
        } else {
            await sendMail(email, process.env.MAIL, `Your code: ${code}`);
            generatedCode = code;
            res.status(200).json({
                status: 1,
                message: 'Code sent'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}

async function register (req, res, next) {
    try {
        let {email, password, code} = req.body;
        password = password.toString();
        await schema.validateAsync({ email, password });
        if (code !== generatedCode) {
            throw new Error('Invalid code');
        }
        const hashedPassword = await hashPassword(password);
        await db('user_info').insert({email, password: hashedPassword});
        res.status(201).json({
            message: 'User created'
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}

module.exports = {
    verify,
    register
};