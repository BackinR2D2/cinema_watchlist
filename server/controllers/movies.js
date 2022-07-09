const getData = require('../helpers/getData');
const db = require('../db/index');
const client = require('../db/redis');

async function getCachedTopMovies (req, res, next) {
    const list = await client.get('topMoviesList');
    if(list) {
        res.json({
            status: 'success',
            data: JSON.parse(list)
        });
    } else {
        next();
    }
}

async function getTopMovies (req, res, next) {
    try {
        const url = 'https://www.imdb.com/chart/top';
        const list = await getData(url);
        await client.set('topMoviesList', JSON.stringify(list), {
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

async function getMoviesCount (req, res, next) {
    try {
        const userId = req.user.id;
        const total = await db.count('id').from('user_list').where({user_id: userId, type: 'movie'});
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

async function searchMovie (req, res, next) {
    try {
        const {searchInp, page} = req.query;
        const userId = req.user.id;
        const offset = (page - 1) * 10;
        const countList = await db('user_list').count('*').whereRaw(`type='movie' AND user_id=${userId} AND lower(info->>'title') ~ trim(lower('${searchInp}'))`);
        const list = await db('user_list').select('*').whereRaw(`type='movie' AND user_id=${userId} AND lower(info->>'title') ~ trim(lower('${searchInp}'))`).limit(10).offset(offset);
        res.json({
            status: 1,
            list,
            countList: countList[0].count
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message || 'Server error'
        });
    }
}

async function getMovies (req, res, next) {
    try {
        const {page} = req.query;

        // page 1 -> offset 0 page 2 -> offset 10
        const offset = (page - 1) * 10;
        const userId = req.user.id;
        const movies = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'movie'}).limit(10).offset(offset);
        res.json({
            status: 1,
            movies
        });
    } catch (error) {
        res.status(500).json({
            status: 0
        });
    }
}

async function filterMovies (req, res, next) {
    try {
        const {filter, page} = req.query;
        const userId = req.user.id;
        const offset = (page - 1) * 10;
        if(filter === 'Favorites') {
            const favoriteMovies = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'movie', favorite: 'yes'}).limit(10).offset(offset);
            const favoriteMoviesCount = await db.count('id').from('user_list').where({user_id: userId, type: 'movie', favorite: 'yes'});
            res.json({
                status: 1,
                filteredMoviesCount: parseInt(favoriteMoviesCount[0].count),
                filteredMovies: favoriteMovies
            });
        } else {
            const filteredMoviesCount = await db.count('id').from('user_list').where({user_id: userId, type: 'movie', status: filter});
            const filteredMovies = await db.select(['id', 'info', 'type', 'status', 'created_at', 'favorite']).from('user_list').where({user_id: userId, type: 'movie', status: filter}).offset(offset).limit(10);
            res.json({
                status: 1,
                filteredMoviesCount: parseInt(filteredMoviesCount[0].count),
                filteredMovies
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0
        });
    }
}

module.exports = {
    getTopMovies,
    getMovies,
    getMoviesCount,
    searchMovie,
    filterMovies,
    getCachedTopMovies
};