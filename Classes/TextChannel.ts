import TextBasedChannel from "./TextBasedChannel.ts";
import Guild from "./Guild.ts";

export default class TextChannel extends TextBasedChannel {
	nsfw: boolean;
	last_message_id: string;
	topic: string;
	parent_id: string;
	last_pin_timestamp: string;

	constructor(guild: Guild, data: any) {
		super(guild, data);

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			Reflect.set(this, keys[i], data[keys[i]]);
		}
	}
}
