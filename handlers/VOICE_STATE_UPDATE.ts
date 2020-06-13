import Client from "../Client.ts";
import VoiceState from "../Classes/VoiceState.ts";

export default function (this: Client, data: any) {
	const guild = this.guilds.get(data.guild_id);
	if (!guild) return;
	const oldState = guild.voice_states.get(data.user_id),
		newState = new VoiceState(this, data);
	guild.voice_states.set(data.user_id, newState);
	this.emit("voiceStateUpdate", oldState, newState);
}
