import { User, Guild } from "../mod.ts";

export class Emoji {
	id: null | string = null;
	name: null | string = null;
	roles: string[] = [];
	//@ts-ignore
	user: User;
	require_colons = false;
	managed = false;
	animated = false;
	available = false;

	constructor(guild: Guild, data: any) {
		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "user":
					this.user = new User(guild.client, data.user);
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}
}
