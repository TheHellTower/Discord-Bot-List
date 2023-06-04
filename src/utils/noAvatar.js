module.exports = async (client, bots) => {
    bots.sort((a, b) => b.likes - a.likes);
    return bots.map(async (x) => {
        if(x.logo.includes("null.png")){
            var json = await client.users.fetch(x.botid)
            x.logo = `https://cdn.discordapp.com/embed/avatars/${json["discriminator"]%5}.png`
        }
        return x;
    });
  };