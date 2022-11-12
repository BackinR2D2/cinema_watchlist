const url =
	process.env.NODE_ENV === 'production'
		? 'https://cinemawatchlist-production.up.railway.app/api'
		: 'http://localhost:4000/api';

export default url;
