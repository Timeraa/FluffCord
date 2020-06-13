import Guild from "./Guild.ts";
import Client from "../Client.ts";

export default class GuildChannel {
	client: Client;
	id: string;
	type: number;
	position: number;
	permission_overwrites: any;
	name: string;
	guild: Guild;

	constructor(guild: Guild, data: any) {
		this.client = guild.client;

		const keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "guild_id":
					this.guild = guild;
					break;
				case "id":
					this.id = data.id;
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}
}
