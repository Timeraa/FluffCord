import { Client } from "../mod.ts";

export class VoiceState {
	guild_id = "";
	channel_id = "";
	user_id = "";
	session_id = "";
	deaf = false;
	mute = false;
	self_deaf = false;
	self_mute = false;
	self_stream? = false;
	self_video = false;
	suppress = false;
	constructor(public client: Client, data: any) {
		for (const key of Object.keys(data)) {
			if (["member"].includes(key)) continue;
			Reflect.set(this, key, data[key]);
		}
	}
	get guild() {
		return this.client.guilds.get(this.guild_id);
	}
	get member() {
		return this.guild?.members.get(this.user_id);
	}
	get channel() {
		return this.guild?.channels.get(this.channel_id);
	}
}
