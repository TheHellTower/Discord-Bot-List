const Event = globalThis.TheHellTower.client.structures.event;

const { BOT_PREFIX } = process.env;

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageCreate",
      type: "once",
      emitter: globalThis.TheHellTower.client,
    });
  }

  async run(message) {
    if (message.author.bot) return;

    if (!message.member) await message.guild.members.fetch(message.author.id);

    const mentionRegex = RegExp(`^<@!?${this.client.user.id}>( |)$`);
    const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

    /// ////////////////////////////////////
    if (
      message.content.match(mentionRegex) ||
      message.content.match(mentionRegexPrefix)
    ) {
      message.channel.send(`My prefix is  \`${BOT_PREFIX}\` !`);
    }
    if (!message.content.startsWith(BOT_PREFIX)) return;

    const [cmd, ...args] = message.content
      .slice(BOT_PREFIX.length)
      .trim()
      .split(/ +/g);

    const command =
      this.client.commands.get(cmd.toLowerCase()) ||
      this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

    if (command) {
      const data = {
        cmd: command,
      };
      command.run(message, args, data);
    }
  }

  async buildHelp(message) {
    const commands = await this.FetchCommands(message);

    const helpMessage = [];
    for (const [category, list] of commands) {
      helpMessage.push(
        `**${category} Commands**:\n`,
        list
          .map(this.formatCommand.bind(this, message, BOT_PREFIX, false))
          .join("\n"),
        ""
      );
    }

    return helpMessage.join("\n");
  }

  async buildDisplay(message) {
    const commands = await this.FetchCommands(message);
    const display = new RichDisplay();
    const color = message.member.displayColor;
    for (const [category, list] of commands) {
      display.addPage(
        new MessageEmbed()
          .setTitle(`${category} Commands`)
          .setColor(color)
          .setDescription(
            list
              .map(this.formatCommand.bind(this, message, BOT_PREFIX, true))
              .join("\n")
          )
      );
    }

    return display;
  }

  formatCommand(message, BOT_PREFIX, richDisplay, command) {
    const description = isFunction(command.description)
      ? command.description(message.language)
      : command.description;
    return richDisplay
      ? `• ${BOT_PREFIX}${command.name} → ${description}`
      : `• **${BOT_PREFIX}${command.name}** → ${description}`;
  }

  async FetchCommands(message) {
    const run = this.client.inhibitors.run.bind(
      this.client.inhibitors,
      message
    );
    const commands = new Map();
    await Promise.all(
      this.client.commands.map((command) =>
        run(command, true)
          .then(() => {
            const category = commands.get(command.category);
            if (category) category.push(command);
            else commands.set(command.category, [command]);
          })
          .catch(() => {
            // noop
          })
      )
    );

    return commands;
  }
};
