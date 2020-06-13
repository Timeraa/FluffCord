import { TextBasedChannel, Guild } from "../mod.ts";

export class TextChannel extends TextBasedChannel {
	nsfw = false;
	last_message_id = "";
	topic = "";
	parent_id = "";
	last_pin_timestamp = "";

	constructor(guild: Guild, data: any) {
		super(guild, data);

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			Reflect.set(this, keys[i], data[keys[i]]);
		}
	}
}
