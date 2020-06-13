import Client from "../Client.ts";
import Guild from "../Classes/Guild.ts";

export default function (this: Client, data: any) {
	this.emit(
		"channelDelete",
		(this.guilds.get(data.guild_id) as Guild).channels.get(data.id)
	);

	(this.guilds.get(data.guild_id) as Guild).channels.delete(data.id);
}
