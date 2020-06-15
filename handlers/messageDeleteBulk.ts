import { Client, Message } from "../mod.ts";

export default function (this: Client, data: any) {
	const guild = this.guilds.get(data.guild_id)!,
		messages: Message[] = data.ids.map(
			(id: string) => guild.messageCache.get(id)!
		);

	this.emit("messageDeleteBulk", messages);
}
