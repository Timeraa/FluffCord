import Client from "../Client.ts";
import Emoji from "../Classes/Emoji.ts";
import Guild from "../Classes/Guild.ts";

export default function (this: Client, data: any) {
	const guild = this.guilds.get(data.guild_id)!;
	const oldEmojis = guild.emojis,
		newEmojis = data.emojis.map((e: any) => new Emoji(guild, e));
	for (const emoji of newEmojis) {
		const oldEmoji = guild.emojis.find(
			e => e.id === emoji.id || e.name === emoji.name
		);
		if (oldEmoji) {
			oldEmojis.splice(
				oldEmojis.findIndex(e => e.id === emoji.id || e.name === emoji.name),
				1
			);
			if (
				oldEmoji.name !== emoji.name ||
				oldEmoji.roles.filter(x => !emoji.roles.includes(x)).length > 0 ||
				oldEmoji.roles.filter(x => emoji.roles.includes(x)).length > 0
			) {
				this.emit("guildEmojiUpdate", guild, oldEmoji, emoji);
			}
		} else {
			// Added
			if (
				oldEmojis.findIndex(
					(e: any) => e.id === emoji.id || e.name === emoji.name
				) === -1
			) {
				this.emit("guildEmojiCreate", guild, emoji);
			}
		}
	}
	for (const emoji of oldEmojis) {
		this.emit("guildEmojiDelete", guild, emoji);
	}
	guild.emojis = newEmojis.map((e: any) => new Emoji(guild, e));
}
