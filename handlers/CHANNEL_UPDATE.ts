import Client from "../Client.ts";
import GuildChannel from "../Classes/GuildChannel.ts";
import TextChannel from "../Classes/TextChannel.ts";
import VoiceChannel from "../Classes/VoiceChannel.ts";

export default function (this: Client, data: any) {
	let channel: TextChannel | GuildChannel;

	const guild = this.guilds.get(data.guild_id)!;

	switch (data.type) {
		case 0:
		case 1:
			channel = new TextChannel(guild, data);
			break;
		case 2:
			channel = new VoiceChannel(guild, data);
			break;
		/* case 4:
			guildChannels.set(data.id, new CategoryChannel(guild, data));
				break;
			case 5:
			guildChannels.set(data.id, new NewsChannel(guild, data));
				break;
			case 6:
			guildChannels.set(data.id, new StoreChannel(guild, data));
			break; */
		default:
			channel = new GuildChannel(guild, data);
			break;
	}

	const oldChannel = guild.channels.get(channel.id);

	guild.channels.set(channel.id, channel);

	this.emit("channelUpdate", oldChannel, channel);
}
