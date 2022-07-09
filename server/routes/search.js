const router = require('express').Router();
const axios = require('axios');
const client = require('../db/redis');

async function getCachedSearch (query) {
    const search = await client.get(`${query}`);
    console.log(search);
    if(search) return search;
    return null;
}

router.post('/search', async (req, res) => {
    try {
        const userInput = req.body;
        const cachedSearch = await getCachedSearch(userInput.res);
        if(cachedSearch) {
            res.json({
                results: JSON.parse(cachedSearch),
            })
        } else {
            const response = await axios.get(`https://v2.sg.media-imdb.com/suggestion/${(userInput.res)[0]}/${userInput.res}.json`, {
            headers: {
                'Accept': 'application/json',
                'Origin': 'https://www.imdb.com',
                'Referer': 'https://www.imdb.com/',
                'User-Agent': process.env.USER_AGENT    
            }
        });
            const results = response.data.d && response.data.d.filter(el => el.q !== undefined);
            await client.set(`${userInput.res}`, JSON.stringify(results), {
                EX: process.env.REDIS_EXPIRE_TIME,
            });
            res.json({
                results
            });
        }  
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: 'Server Error'
        });
    }
})

module.exports = router;