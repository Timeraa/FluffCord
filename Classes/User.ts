import { Client, TextChannel } from "../mod.ts";

export class User {
	id = "";
	username = "";
	discriminator = "";
	avatar? = "";
	bot = false;
	flags? = 0;
	public_flags = 0;
	dmChannel: TextChannel | null = null;

	constructor(private client: Client, data: any) {
		const userKeys = Object.keys(data);
		for (let i = 0; i < userKeys.length; i++) {
			Reflect.set(this, userKeys[i], data[userKeys[i]]);
		}
	}

	get tag() {
		return this.username + "#" + this.discriminator;
	}

	async openDM(): Promise<TextChannel> {
		if (this.dmChannel) return this.dmChannel;
		return await this.client
			.request(`users/@me/channels`, "POST", { recipient_id: this.id })
			.then(c => {
				const channel = new TextChannel(this.client.guilds.get(c.guild_id)!, c);
				this.dmChannel = channel;
				return channel;
			});
	}

	async send(content: string) {
		const ch = await this.openDM();
		return ch.send(content);
	}

	avatarURL(
		options: {
			format?: "webp" | "png" | "jpg" | "jpeg" | "gif";
			dynamic?: boolean;
			size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
		} = { dynamic: true, format: "png" }
	) {
		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}${
			this.avatar?.startsWith("a_") && options.dynamic
				? ".gif"
				: "." + options.format
		}${options.size ? "?size=" + options.size : ""}`;
	}

	toString() {
		return `<@${this.id}>`;
	}
}
