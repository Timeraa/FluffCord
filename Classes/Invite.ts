import { Emoji, Guild, GuildMember, User } from "../mod.ts";
import { TextChannel } from "./TextChannel.ts";
import { VoiceChannel } from "./VoiceChannel.ts";
import { GuildChannel } from "./GuildChannel.ts";
import { Client } from "../Client.ts";

export class Invite {
	private client: Client;
	code = "";
	//@ts-ignore
	guild: Guild;
	//@ts-ignore
	channel: TextChannel | VoiceChannel | GuildChannel;
	//@ts-ignore
	inviter: User;
	approximate_member_count = 0;

	constructor(client: Client, data: any) {
		this.client = client;
		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "guild":
					this.guild = client.guilds.get(data.guild.id)!;
					break;
				case "channel":
					this.channel = client.guilds
						.find(g => g.channels.has(data.channel.id))!
						.channels.get(data.channel.id)!;
					break;
				case "inviter":
					this.inviter = new User(client, data.inviter);
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}

	async delete() {
		this.client
			.request(`invites/${this.code}`, "DELETE")
			.then(data => new Invite(this.client, data))
			.catch(err => {
				throw `${err.code} - ${err.message}`;
			});
	}
}
