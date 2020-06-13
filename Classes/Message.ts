import Client from "../Client.ts";
import Guild from "./Guild.ts";
import GuildMember from "./GuildMember.ts";
import TextChannel from "./TextChannel.ts";
import User from "./User.ts";
import Reaction from "./Reaction.ts";
import Collection from "./Collection.ts";

export default class Message {
	private client: Client;
	id: string;
	channel: TextChannel | TextChannel;
	guild: Guild;
	author: User;
	member: GuildMember;
	content: string;
	timestamp: number;
	edited_timestamp: number;
	tts: boolean;
	mentions_everyone: boolean;
	mentions: User[];
	mention_roles: any;
	attachments: any;
	embeds: any;
	reactions: Collection<string, Reaction> = new Collection();
	nonce: number | string;
	pinned: boolean;
	webhook_id: string;
	activity: any;
	application: any;
	message_reference: any;
	flags: number;

	constructor(client: Client, data: any) {
		this.client = client;

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "timestamp": {
					this.timestamp = new Date(data.timestamp).getTime();
					break;
				}
				case "reactions":
					for (let i = 0; i < data.reactions.length; i++) {
						this.reactions.set(
							data.reactions[i].emoji.id || data.reactions[i].emoji.name!,
							new Reaction(this.guild, data.reactions[i])
						);
					}
					break;
				case "guild_id": {
					this.guild = client.guilds.get(data.guild_id)!;

					//TODO Find out if this is actually necessary (probs not idk)
					this.channel.guild = this.guild;
					break;
				}
				case "channel_id": {
					if (data.guild_id)
						this.channel = <TextChannel>(
							client.guilds.get(data.guild_id)!.channels.get(data.channel_id)
						);
					else {
						const guild = client.guilds.find(g =>
							g.channels.has(data.channel_id)
						);
						if (guild) {
							this.guild = guild!;
							this.channel = <TextChannel>guild.channels.get(data.channel_id);
						} else {
							this.channel = new TextChannel(this.guild, data);
						}
					}
					break;
				}
				case "member": {
					this.member = (client.guilds.get(data.guild_id) as Guild).members.get(
						data.author.id
					) as GuildMember;
					break;
				}
				case "author": {
					this.author = new User(client, data.author);
					break;
				}
				default: {
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
				}
			}
		}
	}

	reply(
		message: string,
		options: {
			tts?: boolean;
		} = {
			tts: false
		}
	) {
		return this.channel.send(`${this.author.toString()}, ${message}`, options);
	}

	async delete(options = { timeout: 0 }): Promise<Message> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.client
					.request(`channels/${this.channel.id}/messages/${this.id}`, "DELETE")
					.then(() => resolve(this))
					.catch(err => reject(`${err.code} - ${err.message}`));
			}, options.timeout);
		});
	}

	async react(emoji: string): Promise<Message> {
		return this.client
			.request(
				`channels/${this.channel.id}/messages/${this.id}/reactions/${encodeURI(
					emoji
				)}/@me`,
				"PUT"
			)
			.then(() => this)
			.catch(err => {
				throw `${err.code} - ${err.message}`;
			});
	}

	async edit(
		content: string,
		options: {
			tts?: boolean;
			embed?: any;
		} = {
			tts: false,
			embed: null
		}
	): Promise<Message> {
		const tts = options.tts,
			embed = options.embed;

		return this.client
			.request(`channels/${this.channel.id}/messages/${this.id}`, "PATCH", {
				content,
				tts,
				embed
			})
			.then(
				msg =>
					(this.client.guilds.get(this.guild!.id) as Guild).messageCache.get(
						msg.id
					) as Message
			)
			.catch(err => {
				throw `${err.code} - ${err.message}`;
			});
	}
}
