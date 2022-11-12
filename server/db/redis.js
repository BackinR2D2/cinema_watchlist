const redis = require('redis');
const env = process.env.NODE_ENV === 'production';
let client;
env
	? (client = redis.createClient({
			url: process.env.REDIS_TLS_URL,
			socket: {
				tls: true,
				rejectUnauthorized: false,
				connectTimeout: 50000,
			},
	  }))
	: (client = redis.createClient());

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectClient() {
	await client.connect();
}

connectClient();

module.exports = client;
