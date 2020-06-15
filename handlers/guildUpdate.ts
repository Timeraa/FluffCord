import { Client, Guild } from "../mod.ts";

export default function (this: Client, data: any) {
	const guild = new Guild(this, data);

	this.emit("guildUpdate", this.guilds.get(data.id)!, guild);

	this.guilds.set(data.id, guild);
}
