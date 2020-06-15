import { Client, Role } from "../mod.ts";

export default function (this: Client, data: any) {
	const oldRole = this.guilds.get(data.guild_id)!.roles.get(data.id)!,
		newRole = this.guilds
			.get(data.guild_id)!
			.roles.set(data.role.id, new Role(this.guilds.get(data.guild_id)!, data));

	this.emit("guildRoleUpdate", oldRole, newRole);
}
