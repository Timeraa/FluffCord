import {
	Client,
	Collection,
	Role,
	VoiceState,
	GuildMember,
	Emoji,
	TextChannel,
	VoiceChannel,
	GuildChannel,
	VoiceConnection,
	Message
} from "../mod.ts";

export interface UnavailableGuild {
	id: string;
	unavailable: boolean;
}

export enum ChannelType {
	TEXT = 0,
	VOICE = 2,
	CATEGORY = 4,
	NEWS = 5,
	STORE = 6
}

export class Guild {
	//@ts-ignore
	client: Client;
	id = "";
	name = "";
	icon: null | string = null;
	splash: null | string = null;
	discovery_splash: null | string = null;
	//@ts-ignore
	owner: GuildMember;
	owner_id = "";
	permissions = 0;
	region = "";
	afk_channel_id = "";
	afk_timeout = 0;
	embed_enabled = false;
	embed_channel_id = "";
	verification_level = 0;
	default_message_notification = 0;
	explicit_content_filter = 0;
	roles: Collection<string, Role> = new Collection();
	emojis: Emoji[] = [];
	features: string[] = [];
	mfa_level: 0 | 1 = 0;
	application_id = "";
	widget_enabled = false;
	widget_channel_id = "";
	system_channel_id = "";
	system_channel_flags = 0;
	//TODO Date.now instead
	joined_at = new Date();
	large = false;
	unavailable = true;
	member_count = 0;
	voice_states: Collection<string, VoiceState> = new Collection();
	members: Collection<string, GuildMember> = new Collection();
	channels: Collection<
		string,
		GuildChannel | TextChannel | TextChannel | VoiceChannel
	> = new Collection();
	//TODO Shouldn't this be an array?
	presences: any;
	max_presences = 0;
	max_members = 0;
	vanity_url_code = "";
	description = "";
	banner = "";
	premium_tier = 0;
	premium_subscription_count = 0;
	preferred_locale = "";
	public_updates_channel_id = "";
	max_video_channel_users = 0;
	approximate_member_count = 0;
	approximate_presence_count: null | number = null;
	messageCache: Collection<string, Message> = new Collection();
	voiceConnection: null | VoiceConnection = null;

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
					guild.roles.forEach((x: any) =>
						this.roles.set(x.id, new Role(guild, x))
					);
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

	async createChannel(options: {
		name: string;
		type?: ChannelType;
		topic?: string;
		bitrate?: number;
		user_limit?: number;
		rate_limit_per_user?: number;
		position?: number;
		permission_overwrites?: any;
		parent_id?: string;
		nsfw?: boolean;
	}) {
		return this.client
			.request(`guilds/${this.id}/channels`, "POST", options)
			.then(channel => {
				switch (channel.type) {
					case 0:
						return new TextChannel(this, channel);
					case 2:
						return new VoiceChannel(this, channel);
					/*					case 4:
				guildChannels.set(data.id, new CategoryChannel(data));
				break;
				case 5:
					guildChannels.set(data.id, new NewsChannel(data));
					break;
					case 6:
						guildChannels.set(data.id, new StoreChannel(data));
						break; */
					default:
						return new GuildChannel(this, channel);
				}
			})
			.catch(err => {
				throw `${err.code} - ${err.message}`;
			});
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
