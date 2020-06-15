import { Client, Reaction, TextChannel } from "../mod.ts";

export default async function (this: Client, data: any) {
	//TODO DM Handling
	if (!data.guild_id) return;

	const guild = this.guilds.get(data.guild_id)!,
		reaction =
			(await (guild.channels.get(data.channel_id)! as TextChannel).fetch(
				data.message_id
			))!.reactions.get(data.emoji.id || data.emoji.name) ||
			new Reaction(guild, data);

	reaction.count--;

	if (reaction.count === 0)
		guild.messageCache
			.get(data.message_id)!
			.reactions.delete(reaction.emoji.id || reaction.emoji.name!);
	else
		guild.messageCache
			.get(data.message_id)!
			.reactions.set(reaction.emoji.id || reaction.emoji.name!, reaction);

	this.emit("messageReactionRemove", reaction);
}
