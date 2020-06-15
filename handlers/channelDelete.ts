import { Client } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit(
		"channelDelete",
		this.guilds.get(data.guild_id)!.channels.get(data.id)
	);

	this.guilds.get(data.guild_id)!.channels.delete(data.id);
}
