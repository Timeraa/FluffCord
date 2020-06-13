import Client from "../Client.ts";
import Message from "../Classes/Message.ts";

export default function (this: Client, data: any) {
	const message = new Message(this, data);

	message.guild?.messageCache.set(message.id, message);

	this.emit("messageCreate", message);
}
