import Client from "../Client.ts";

export default function (this: Client, data: any) {
	//TODO DM Handling
	if (!data.guild_id) return;

	const messageCache = this.guilds.get(data.guild_id)!.messageCache;

	this.emit("messageDelete", messageCache.get(data.id));

	messageCache.delete(data.id);
}
