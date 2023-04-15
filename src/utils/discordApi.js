const https = require('https');

const { server: { role_ids: { bot_verifier } }, server: { admin_user_ids, id } } = require("@root/config.json")

module.exports.auth = async(req, res, next) => {
    if (!req.user) return res.redirect("/login");
    
    req.user.staff = false;

    try {
        const member = await req.app.get('client').guilds.cache.get(id).members.fetch(req.user.id);
        if (admin_user_ids.includes(req.user.id) || member.roles.cache.has(bot_verifier))
            req.user.staff = true
    } catch(_) {}

    return next();
}

module.exports.getUser = async (user) => {
    let { accessToken } = user;

    const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    };

    const req = https.request('https://discord.com/api/users/@me', options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', async () => {
            user = JSON.parse(data);
            user = await user.json();
            
            if (user.code === 0) return false;
            return user;
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.end();      

    if (user.code === 0) return false;
    return user;
};