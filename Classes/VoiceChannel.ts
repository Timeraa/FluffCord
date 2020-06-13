import { Guild, GuildChannel } from "../mod.ts";

export class VoiceChannel extends GuildChannel {
	bitrate = 0;
	user_limit = 0;

	constructor(guild: Guild, data: any) {
		super(guild, data);

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			Reflect.set(this, keys[i], data[keys[i]]);
		}
	}
}
