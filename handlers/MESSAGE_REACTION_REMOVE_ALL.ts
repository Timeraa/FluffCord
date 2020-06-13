import Client from "../Client.ts";

export default function (this: Client, data: any) {
	//TODO DM Handling
	if (!data.guild_id) return;

	const guild = this.guilds.get(data.guild_id)!,
		reaction = guild.messageCache
			.get(data.message_id)!
			.reactions.get(data.emoji.id || data.emoji.name)!;

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
