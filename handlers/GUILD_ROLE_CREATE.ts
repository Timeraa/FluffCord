import Client from "../Client.ts";
import Guild from "../Classes/Guild.ts";
import Role from "../Classes/Role.ts";

export default function (this: Client, data: any) {
	const role = new Role(data.role);

	(this.guilds.get(data.guild_id) as Guild).roles.set(role.id, role);

	this.emit("roleCreate", role);
}
