module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.category = options.category || "None";
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.usage = `${this.name} ${options.usage || ''}`.trim();
	}

	async run(message, args) {
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}
};