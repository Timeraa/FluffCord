import { Client } from "../mod.ts";

export default function (this: Client, data: any) {
	//TODO
	return;
	const guild = this.guilds.get(data.guild_id)!,
		oldPresence = guild.members.get(data.user.id)!,
		newPresence = guild.members.get(data.user.id)!;

	this.emit("presenceUpdate", oldPresence, newPresence);
}
