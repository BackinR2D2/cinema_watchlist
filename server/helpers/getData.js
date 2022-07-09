const cheerio = require('cheerio');
const axios = require('axios');
const client = require('../db/redis');

module.exports = async function (url) {
        try {
            const {data} = await axios.get(url, {
                headers: {
                    'User-Agent': process.env.USER_AGENT,
                    'Accept': process.env.ACCEPT,
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'max-age=0',
                }
            });
            const $ = cheerio.load(data, null, false);
            const tbody = $('#main > div > span > div > div > div.lister > table > tbody').children();
            const list = [];
            tbody.map((tr) => {
                const title = $(tbody[tr]).find('td.titleColumn > a').text();
                const year = $(tbody[tr]).find('td.titleColumn > span.secondaryInfo').text();
                const place = tr + 1;
                const rating = ($(tbody[tr]).find('td.ratingColumn.imdbRating').text()).trim();
                const imdbId = $(tbody[tr]).find('td.titleColumn > a').attr('href').split('/')[2];
                const poster = $(tbody[tr]).find('td.posterColumn > a > img').attr('src');
                const movie = {
                    title,
                    year,
                    place,
                    rating,
                    imdbId,
                    poster
                };
                list.push(movie);
            });
            return list;
        } catch (error) {
            throw error;
        }
}