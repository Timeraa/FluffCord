import { Client, Role } from "../mod.ts";

export default function (this: Client, data: any) {
	const role = new Role(this.guilds.get(data.guild_id)!, data.role);

	this.guilds.get(data.guild_id)!.roles.set(role.id, role);

	this.emit("guildRoleCreate", role);
}
