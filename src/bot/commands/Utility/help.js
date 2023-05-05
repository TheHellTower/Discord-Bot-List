const Command = globalThis.TheHellTower.client.structures.command;
const { MessageEmbed, EmbedBuilder } = require("discord.js");
const Bots = require("@models/bots");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "help",
      category: "Utility",
      aliases: ["commands", "cmd", "cmds"],
      description: "Show you info about a command or the list of commands",
      usage: "[Command:command]",
    });
  }

  async run(message, args) {
    let command = args[0];
    if (command) {
      command =
        this.client.commands.get(command.toLowerCase()) ||
        this.client.commands.get(
          this.client.aliases.get(command.toLowerCase())
        );
    }

    if (command) {
      return message.reply({
        content: `\`\`\`asciidoc\n= ${command.name} =\n> Description: ${command.description}\n> Usage: ${command.usage}\n\`\`\``,
      });
    }
    const commands = await this.FetchCommands(message);
    const e = new EmbedBuilder().setTitle("Commands");
    for (const [category, list] of commands) {
      var commandsList = "";
      list.forEach((command) => {
        commandsList += `\`${command.name}\`: \`${command.description}\` \n`;
      });
      e.addFields({ name: `${category} Commands`, value: `${commandsList}` });
    }
    return message.reply({ embeds: [e] });
  }

  async FetchCommands(message) {
    const commands = new Map();
    this.client.commands.forEach((command) => {
      const category = commands.get(command.category);
      if (category) category.push(command);
      else commands.set(command.category, [command]);
    });

    return commands;
  }
};
