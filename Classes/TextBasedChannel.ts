import GuildChannel from "./GuildChannel.ts";
import Message from "./Message.ts";
import Guild from "./Guild.ts";

export default class TextBasedChannel extends GuildChannel {
	private typingInterval: number;
	private typingCounts = 0;

	constructor(guild: Guild, data: any) {
		super(guild, data);
	}

	async send(
		content: string,
		options: {
			tts?: boolean;
			embed?: any;
		} = {
			tts: false,
			embed: null
		}
	) {
		const tts = options.tts,
			embed = options.embed;

		return this.client
			.request(`channels/${this.id}/messages`, "POST", {
				content,
				tts,
				embed
			})
			.then((msg: any) => new Message(this.client, msg))
			.catch((err: any) => {
				throw `${err.code} - ${err.message}`;
			});
	}

	async startTyping() {
		return new Promise((resolve, reject) => {
			this.typingCounts++;

			if (!this.typingInterval) {
				const callback = () => {
					this.client
						.request(`channels/${this.id}/typing`, "POST")
						.then(resolve)
						.catch((err: any) => reject(`${err.code} - ${err.message}`));
				};

				callback();
				this.typingInterval = setInterval(callback, 9000);
			} else resolve();
		});
	}

	stopTyping(force = false) {
		if (this.typingCounts === 0) return;

		if (!force) this.typingCounts--;
		else this.typingCounts = 0;

		if (this.typingCounts === 0) clearInterval(this.typingInterval);
	}

	async delete() {
		return this.client
			.request(`channels/${this.id}`, "DELETE")
			.then(() => this)
			.catch((err: any) => {
				throw `${err.code} - ${err.message}`;
			});
	}

	async fetch(id: string) {
		if (this.guild.messageCache.has(id)) return this.guild.messageCache.get(id);

		return this.client
			.request(`channels/${this.id}/messages/${id}`, "GET")
			.then((msg: any) => {
				const message = new Message(this.client, msg);
				if (this.guild) this.guild.messageCache.set(message.id, message);
				return message;
			})
			.catch((err: any) => {
				throw `${err.code} - ${err.message}`;
			});
	}
}
