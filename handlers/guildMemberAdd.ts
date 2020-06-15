import { Client, GuildMember } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit(
		"guildMemberAdd",
		new GuildMember(this, this.guilds.get(data.guild_id)!, data)
	);
}
