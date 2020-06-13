import Client from "../Client.ts";
import Guild from "./Guild.ts";
import GuildChannel from "./GuildChannel.ts";

export default class VoiceChannel extends GuildChannel {
	bitrate: number;
	user_limit: number;

	constructor(guild: Guild, data: any) {
		super(guild, data);

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			Reflect.set(this, keys[i], data[keys[i]]);
		}
	}
}
