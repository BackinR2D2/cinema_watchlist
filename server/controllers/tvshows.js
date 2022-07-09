const getData = require('../helpers/getData');
const db = require('../db/index');
const client = require('../db/redis');

async function getCachedTopTvShows (req, res, next) {
    const list = await client.get('topTvShowsList');
    if(list) {
        res.json({
            status: 'success',
            data: JSON.parse(list)
        });
    } else {
        next();
    }
}

async function getTopTvShows (req, res, next) {
    try {
        const url = 'https://www.imdb.com/chart/toptv';
        const list = await getData(url);
        await client.set('topTvShowsList', JSON.stringify(list), {
            EX: process.env.REDIS_EXPIRE_TIME,
            NX: true
        });
        res.json({
            status: 'success',
            data: list
        });
    } catch (error) {
        res.status(500).json({
            status: 0
        });
    }
}

async function getTvShowsCount (req, res, next) {
    try {
        const userId = req.user.id;
        const total = await db.count('id').from('user_list').where({user_id: userId, type: 'tvshow'});
        res.json({
            status: 1,
            total
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server error'
        });
    }
}

// select * from user_list where type='movie' and user_id = 8 and lower(info->>'title') ~ trim(lower('      god   '));

async function searchTvShows (req, res, next) {
    try {
        const {searchInp, page} = req.query;
        console.log(searchInp, page);
        const userId = req.user.id;
        const offset = (page - 1) * 10;
        const countList = await db('user_list').count('*').whereRaw(`type='tvshow' AND user_id=${userId} AND lower(info->>'title') ~ trim(lower('${searchInp}'))`);
        const list = await db('user_list').select('*').whereRaw(`type='tvshow' AND user_id=${userId} AND lower(info->>'title') ~ trim(lower('${searchInp}'))`).limit(10).offset(offset);
        res.json({
            status: 1,
            list,
            countList: countList[0].count
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: error.message || 'Server error'
        });
    }
}

async function getTvShows (req, res, next) {
    try {
        const {page} = req.query;

        // page 1 -> offset 0 page 2 -> offset 10
        const offset = (page - 1) * 10;
        const userId = req.user.id;
        const tvshows = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'tvshow'}).limit(10).offset(offset);
        res.json({
            status: 1,
            tvshows
        });
    } catch (error) {
        res.status(500).json({
            status: 0
        });
    }
}

async function filterTvShows (req, res, next) {
    try {
        const {filter, page} = req.query;
        const userId = req.user.id;
        const offset = (page - 1) * 10;
        if(filter === 'Favorites') {
            const favoriteTvShows = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'tvshow', favorite: 'yes'}).limit(10).offset(offset);
            const favoriteTvShowsCount = await db.count('id').from('user_list').where({user_id: userId, type: 'tvshow', favorite: 'yes'});
            res.json({
                status: 1,
                filteredTvShowsCount: parseInt(favoriteTvShowsCount[0].count),
                filteredTvShows: favoriteTvShows
            });
        } else {
            const filteredTvShowsCount = await db.count('id').from('user_list').where({user_id: userId, type: 'tvshow', status: filter});
            const filteredTvShows = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'tvshow', status: filter}).offset(offset).limit(10);
            res.json({
                status: 1,
                filteredTvShowsCount: parseInt(filteredTvShowsCount[0].count),
                filteredTvShows
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0
        });
    }
}

module.exports = {
    getTopTvShows,
    getTvShows,
    getTvShowsCount,
    searchTvShows,
    filterTvShows,
    getCachedTopTvShows
};