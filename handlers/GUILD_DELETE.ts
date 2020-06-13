import Client from "../Client.ts";

export default function (this: Client, data: any) {
	if (!this.guilds.has(data.id)) return;

	const i = this.unavailableGuilds.findIndex(x => x.id === data.id);

	if (i >= -1) {
		this.emit("guildUnavailable", this.guilds.get(data.id));
		return;
	}

	this.emit("guildDelete", this.guilds.get(data.id));
	this.guilds.delete(data.id);
}
