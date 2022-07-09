const db = require('../db');

async function addToWatchlist (req, res, next) {
    try {
        const mediaData = (req.body.info)[0];
        const mediaType = (req.body.info)[1];
        const userId = req.user.id;
        const mediaFound = await db('user_list').select('id').whereRaw("info->>'title'=?", [mediaData.title]);
        if(mediaFound.length === 0) {
            await db('user_list').insert({
                user_id: userId,
                info: JSON.stringify(mediaData),
                type: mediaType,
                status: req.body.status
            });
            res.status(201).json({
                status: 1,
                message: 'Added to watchlist'
            });
        } else {
            res.status(400).json({
                status: 0,
                message: 'Media already selected'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server Error'
        });
    }
}

async function getNoteBody (req, res, next) {
    try {
        const userId = req.user.id;
        const mediaId = req.body.mediaId;
        const noteBody = await db('user_list').select('notebody').where({
            user_id: userId,
            id: mediaId
        });
        res.status(200).json({
            status: 1,
            noteBody
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: 'Server Error'
        });
    }
}

async function deleteWatchlistMedia (req, res, next) {
    try {
        const mediaId = req.params.id;
        const userId = req.user.id;
        await db('user_list').del().where({
            user_id: userId,
            id: mediaId
        });
        res.status(201).json({
            status: 1,
            message: 'Media deleted'
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server Error'
        });
    }
}

async function updateNoteBody (req, res, next) {
    try {
        const {noteBody, mediaId} = req.body;
        const userId = req.user.id;
        await db('user_list').where({
            user_id: userId,
            id: mediaId
        }).update({
            notebody: noteBody
        });
        res.status(201).json({
            status: 1,
            message: 'Note updated'
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server Error'
        });
    }
}

async function changeStatus (req, res, next) {
    try {
        const {status, id} = req.body;
        const userId = req.user.id;
        let statusText = null;
        switch(status) {
            case 'watching':
                statusText = 'Watching';
                break;
            case 'completed':
                statusText = 'Completed';
                break;
            case 'onHold':
                statusText = 'On Hold';
                break;
            case 'dropped':
                statusText = 'Dropped';
                break;
            case 'planToWatch':
                statusText = 'Plan To Watch';
                break;
            default:
                statusText = 'Plan To Watch';
                break;
        }
        await db('user_list').where({
            user_id: userId,
            id
        }).update({
            status: statusText
        });
        res.status(201).json({
            status: 1,
            message: 'Status changed'
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server Error'
        })
    }
}

async function changeFavorite (req, res, next) {
    try {
        const {id, favorite} = req.body;
        const userId = req.user.id;
        await db('user_list').where({
            user_id: userId,
            id
        }).update({
            favorite
        });
        res.status(201).json({
            status: 1,
            message: 'Favorite changed'
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server Error'
        });
    }
}

async function getWatchlist (req, res, next) {
    try {
        const userId = req.user.id;
        const watchlist = await db('user_list').where({
            user_id: userId,
            status: 'Plan To Watch'
        });
        res.status(200).json({
            status: 1,
            watchlist
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: 'Server Error'
        });
    }
}

module.exports = {
    addToWatchlist,
    updateNoteBody,
    getNoteBody,
    deleteWatchlistMedia,
    changeStatus,
    changeFavorite,
};