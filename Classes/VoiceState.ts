import Client from "../Client.ts";

export default class VoiceState {
	guild_id: string;
	channel_id: string;
	user_id: string;
	session_id: string;
	deaf: boolean;
	mute: boolean;
	self_deaf: boolean;
	self_mute: boolean;
	self_stream?: boolean = false;
	self_video: boolean;
	suppress: boolean;
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
