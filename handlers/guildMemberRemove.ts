import { Client, User } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit(
		"guildMemberRemove",
		this.guilds.get(data.guild_id)!,
		new User(this, data.user)
	);
}
