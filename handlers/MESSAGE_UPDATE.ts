import Client from "../Client.ts";
import Message from "../Classes/Message.ts";

export default function (this: Client, data: any) {
	const message = new Message(this, data),
		old = this.guilds.get(data.guild_id)?.messageCache.get(message.id);

	if (
		!old ||
		old.guild.id !== message.guild.id ||
		old.channel.id !== message.channel.id ||
		old.content === message.content
	)
		return;

	this.emit("messageUpdate", old, message);
}
