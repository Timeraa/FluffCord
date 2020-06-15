import { Client } from "../mod.ts";

export default function (this: Client, data: any) {
	const role = this.guilds.get(data.guild_id)!.roles.get(data.id)!;

	this.guilds.get(data.guild_id)!.roles.delete(data.id);

	this.emit("guildRoleDelete", role);
}
