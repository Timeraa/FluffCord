import Client from "../Client.ts";
import Collection from "./Collection.ts";
import Emoji from "./Emoji.ts";
import GuildChannel from "./GuildChannel.ts";
import GuildMember from "./GuildMember.ts";
import Message from "./Message.ts";
import Role from "./Role.ts";
import TextChannel from "./TextChannel.ts";
import VoiceChannel from "./VoiceChannel.ts";
import VoiceConnection from "./VoiceConnection.ts";
import VoiceState from "./VoiceState.ts";

export interface UnavailableGuild {
	id: string;
	unavailable: boolean;
}

export default class Guild {
	client: Client;
	id: string;
	name: string;
	icon: null | string;
	splash: null | string;
	discovery_splash: null | string;
	owner: GuildMember;
	owner_id: string;
	permissions: number;
	region: string;
	afk_channel_id: string;
	afk_timeout: number;
	embed_enabled: boolean;
	embed_channel_id: string;
	verification_level: number;
	default_message_notification: number;
	explicit_content_filter: number;
	roles: Collection<string, Role> = new Collection();
	emojis: Emoji[];
	features: string[];
	mfa_level: 0 | 1;
	application_id: string;
	widget_enabled: boolean;
	widget_channel_id: string;
	system_channel_id: string;
	system_channel_flags: number;
	joined_at: Date;
	large: boolean;
	unavailable: boolean;
	member_count: number;
	voice_states: Collection<string, VoiceState> = new Collection();
	members: Collection<string, GuildMember> = new Collection();
	channels: Collection<
		string,
		GuildChannel | TextChannel | TextChannel | VoiceChannel
	> = new Collection();
	presences: any;
	max_presences: number;
	max_members: number;
	vanity_url_code: string;
	description: string;
	banner: string;
	premium_tier: number;
	premium_subscription_count: number;
	preferred_locale: string;
	public_updates_channel_id: string;
	max_video_channel_users: number;
	approximate_member_count: number;
	approximate_presence_count: null | number;
	messageCache: Collection<string, Message> = new Collection();
	voiceConnection: VoiceConnection;

	constructor(client: Client, guild: any) {
		this.client = client;
		/**
		 * TODO
		 *	- emojis
		 *	- features
		 *	- voice_states
		 *	- presences
		 */
		const keys = Object.keys(guild);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			switch (key) {
				case "channels":
					guild.channels.forEach((channel: any) => {
						channel.guild_id = guild.id;
						switch (channel.type) {
							case 0:
								this.channels.set(channel.id, new TextChannel(this, channel));
								break;
							case 1:
								this.channels.set(channel.id, new TextChannel(this, channel));
								break;
							case 2:
								this.channels.set(channel.id, new VoiceChannel(this, channel));
								break;
							/*case 4:
								this.channels.set(channel.id, new CategoryChannel(channel));
								break;
							case 5:
								this.channels.set(channel.id, new NewsChannel(channel));
								break;
							case 6:
								this.channels.set(channel.id, new StoreChannel(channel));
								break; */
							default:
								this.channels.set(channel.id, new GuildChannel(this, channel));
								break;
						}
					});
					break;
				case "roles":
					guild.roles.forEach((x: any) => this.roles.set(x.id, new Role(x)));
					break;
				case "members":
					guild.members.forEach((x: any) =>
						this.members.set(x.user.id, new GuildMember(client, this, x))
					);
					break;
				case "emojis":
					this.emojis = guild.emojis.map((e: any) => new Emoji(guild, e));
					break;
				case "voice_states":
					guild.voice_states.forEach((x: any) =>
						this.voice_states.set(x.user_id, new VoiceState(client, x))
					);
					break;
				default:
					Reflect.set(this, key, guild[key]);
					break;
			}
		}
	}

	async joinChannel(
		channel: VoiceChannel,
		deaf = false
	): Promise<VoiceConnection> {
		return new Promise((resolve, reject) => {
			if (!channel) return reject("Unknown channel: " + channel);
			this.client.ws?.send(
				JSON.stringify({
					op: 4,
					d: {
						guild_id: this.id,
						channel_id: channel.id,
						self_mute: false,
						self_deaf: deaf
					}
				})
			);
			const con = new VoiceConnection();
			this.client.on("raw", async (data: any) => {
				if (data.t === "VOICE_SERVER_UPDATE" && data.d.guild_id === this.id) {
					await con.connect(
						this.voice_states.get(this.client.user!.id)!,
						data.d
					);
					resolve(con);
				}
			});
		});
	}
}
