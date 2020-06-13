import User from "./User.ts";
import Guild from "./Guild.ts";

export default class Emoji {
	id: null | string;
	name: null | string;
	roles: string[];
	user: User;
	require_colons: boolean;
	managed: boolean;
	animated: boolean;
	available: boolean;

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
