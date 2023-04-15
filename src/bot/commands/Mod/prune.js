const { PermissionFlagsBits } = require("discord.js");

const Command = globalThis.TheHellTower.client.structures.command;

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: "prune",
            category: "Mod",
            aliases: ["clear", "clean"],
            description: 'Prunes/Clear a certain amount of messages w/o filter.',
            usage: '[limit:integer] [link|invite|bots|you|me|upload|user:user]',
            usageDelim: ' '
        });
    }

    async run(message, args) {
        if(!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply({content: "You don't have the required permission (`Manage Messages`)."});
        var limit = args[0];
        if(!limit) return message.reply({content: "You need to specify a number of messages !"});
        var filter = args[1];
        if(!filter) return message.reply({content: "You need to specify a filer: `[link|invite|bots|you|me|upload|user:user]` !"});
        let messages = await message.channel.messages.fetch({ limit: limit == 1 ? 2 : limit, cache: false });
        if (filter) {
            const user = typeof filter !== 'string' ? filter : null;
            const type = typeof filter === 'string' ? filter : 'user';
            messages = messages.filter(this.getFilter(message, type, user));
        }
        messages = Array.from(messages.values());
        message.reply({content: `Successfully deleted \`${messages.length}\` messages from \`${limit}\`.`}).then(async () => {
            await message.channel.bulkDelete(messages);
        });
        return 
    }

    getFilter(message, filter, user) {
        switch (filter) {
            case 'link':
                return msg => /https?:\/\/[^ /.]+\.[^ /.]+/.test(msg.content);
            case 'invite':
                return msg => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discord\.com\/invite)\/.+/.test(msg.content);
            case 'bots':
                return msg => msg.author.bot;
            case 'you':
                return msg => msg.author.id === this.client.user.id;
            case 'me':
                return msg => msg.author.id === message.author.id;
            case 'upload':
                return msg => msg.attachments.size > 0;
            case 'user':
                return msg => msg.author.id === user.id;
            default:
                return () => true;
        }
    }

};