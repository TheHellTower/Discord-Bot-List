const Command = globalThis.TheHellTower.client.structures.command,
    https = require("https"),
    Bots = require("@models/bots"),
    
    { web: {domain_with_protocol} } = require("@root/config.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "widget",
            category: "Bots",
            aliases: [],
            description: "Send a bot generated widget.",
            usage: '[User:user]'
        });
    }

    async run(message, args) {
        let user =
      message.mentions.users.size > 0
        ? message.guild.members.cache.get(message.mentions.users?.first().id)
        : args[0]
        ? await this.client.users.fetch(args[0])
        : message.guild.members.cache.get(message.author.id);
        user = user?.user ? user.user : user;
        if (!user || !user.bot) return message.channel.send(`You didn't ping a bot to get a widget of.`);
        let url = `${domain_with_protocol}/api/embed/${user.id}`;

        https.get(url, (res) => {
            let data = [];
            
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            
            res.on('end', () => {
                const img = Buffer.concat(data);
                if(img.byteLength < 100) return message.reply({content: "Bot not found."});
                return message.reply({ files: [img] });
            });
        
        }).on('error', (err) => {
            console.log('Error: ' + err.message);
        });
    }
};