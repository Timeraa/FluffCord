import { Client, Guild } from "../mod.ts";

export default function (this: Client, data: any) {
	const guild = new Guild(this, data);

	this.guilds.set(data.id, guild);

	if (!this.unavailableGuilds.find(x => x.id === data.id))
		this.emit("guildCreate", guild);

	if (this.unavailableGuilds.length === this.guilds.size) {
		this.ready = true;
		this.emit("ready", this);
	}
}
