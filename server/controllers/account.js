const db = require('../db');

async function getUserData (req, res, next) {
    try {
        const userId = req.user.id;
        const userData = await db.select(['email', 'created_at', 'last_login']).from('user_info').where({id: userId});
        res.json({
            status: 1,
            userData
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server error'
        });
    }
}

async function deletedUser (req, res, next) {
    try {
        const userId = req.user.id;
        await db.delete().from('user_info').where({id: userId});
        await db.delete().from('user_list').where({user_id: userId});
        res.json({
            status: 1,
            message: 'User deleted'
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server error'
        });
    }
}

module.exports = {
    getUserData,
    deletedUser
};