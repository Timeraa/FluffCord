import { Client } from "../mod.ts";

export default function (this: Client, data: any) {
	//TODO Return dm channel
	if (!data.guild_id) return;

	this.emit(
		"typingStart",
		this.guilds.get(data.guild_id)!.channels.get(data.channel_id),
		this.guilds.get(data.guild_id)!.members.get(data.user_id!.user)
	);
}
