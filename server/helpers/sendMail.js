const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_KEY);

async function sendMail (to, from, text) {
    const msg = {
        to,
        from,
        subject: 'Cinema watchlist app',
        text
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        throw error
    }
}

module.exports = sendMail;