import { Guild, Client } from "../mod.ts";

export class GuildChannel {
	//@ts-ignore
	client: Client;
	id = "";
	type = 0;
	position = 0;
	permission_overwrites: any = null;
	name = "";
	//@ts-ignore
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
