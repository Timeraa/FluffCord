import { GuildMember, GuildChannel, Guild, Role } from "../mod.ts";

export enum Permission {
	CREATE_INSTANT_INVITE = 1,
	KICK_MEMBERS = 1 << 1,
	BAN_MEMBERS = 1 << 2,
	ADMINISTRATOR = 1 << 3,
	MANAGE_CHANNELS = 1 << 4,
	MANAGE_GUILD = 1 << 5,
	ADD_REACTIONS = 1 << 6,
	VIEW_AUDIT_LOGS = 1 << 7,
	VOICE_PRIORITY_SPEAKER = 1 << 8,
	STREAM = 1 << 9,
	READ_MESSAGES = 1 << 10,
	SEND_MESSAGES = 1 << 11,
	SEND_TTS_MESSAGES = 1 << 12,
	MANAGE_MESSAGES = 1 << 13,
	EMBED_LINKS = 1 << 14,
	ATTACH_FILES = 1 << 15,
	READ_MESSAGE_HISTORY = 1 << 16,
	MENTION_EVERYONE = 1 << 17,
	EXTERNAL_EMOJIS = 1 << 18,
	VIEW_GUILD_ANALYTICS = 1 << 19,
	VOICE_CONNECT = 1 << 20,
	VOICE_SPEAK = 1 << 21,
	VOICE_MUTE_MEMBERS = 1 << 22,
	VOICE_DEAFEN_MEMBERS = 1 << 23,
	VOICE_MOVE_MEMBERS = 1 << 24,
	VOICE_USE_VAD = 1 << 25,
	CHANGE_NICKNAME = 1 << 26,
	MANAGE_NICKNAMES = 1 << 27,
	MANAGE_ROLES = 1 << 28,
	MANAGE_WEBHOOKS = 1 << 29,
	MANAGE_EMOJIS = 1 << 30,
	ALL = 0b1111111111111111111111111111111,
	ALL_GUILD = 0b1111100000010000000000010111111,
	ALL_TEXT = 0b0110000000001111111110001010001,
	ALL_VOICE = 0b0110011111100000000001100010001
}

export interface PermissionOverwrite {
	id: string;
	allow: number;
	deny: number;
	type: "channel" | "member";
}

export class Permissions {
	public bits: number = 0;
	constructor(
		guild: Guild | null = null,
		role: Role | null = null,
		channel: GuildChannel | null = null,
		member: GuildMember | null = null
	) {
		if (
			guild !== null &&
			role === null &&
			channel === null &&
			member !== null
		) {
			for (const role of member.roles) {
				if (
					(role.bitSet & Permission.ADMINISTRATOR) ===
					Permission.ADMINISTRATOR
				) {
					this.bits = Permission.ADMINISTRATOR;
					break;
				}
				this.bits |= role.bitSet;
			}
		} else if (
			guild === null &&
			role !== null &&
			channel === null &&
			member === null
		) {
			this.bits = role.bitSet;
		} else if (guild !== null && member !== null && channel !== null) {
			this.computeForMember(guild!, member!, channel!);
		}
	}

	private computeForMember(
		guild: Guild,
		member: GuildMember,
		channel: GuildChannel
	): number {
		if (guild.owner_id === member.user.id) return Permission.ALL;
		//* Base permissions are computed from the @everyone role
		let base = guild.roles.find(r => r.id === guild.id)!.bitSet;
		for (const role of member.roles) {
			if (
				(role.bitSet & Permission.ADMINISTRATOR) ===
				Permission.ADMINISTRATOR
			) {
				base = Permission.ADMINISTRATOR;
				break;
			}
			base |= role.bitSet;
		}
		//* Check if any roles have administrator
		if ((base & Permission.ADMINISTRATOR) === Permission.ADMINISTRATOR) {
			return Permission.ADMINISTRATOR;
		}
		let overwrite: PermissionOverwrite | undefined;
		//* Apply @everyone channel overwrite
		if (
			(overwrite = channel.permission_overwrites.find(o => o.id === guild.id))
		) {
			base = (base & ~overwrite.deny) | overwrite.allow;
		}
		//* Apply role overwrites for the member
		let allow = 0,
			deny = 0;
		for (const role of member.roles) {
			if (
				(overwrite = channel.permission_overwrites.find(o => o.id === role.id))
			) {
				allow |= overwrite.allow;
				deny |= overwrite.deny;
			}
		}
		base |= (base & ~deny) | allow;
		//* Apply member specific overwrite
		if (
			(overwrite = channel.permission_overwrites.find(
				o => o.id === member?.user.id
			))
		) {
			base = (base & ~overwrite.deny) | overwrite.allow;
		}
		return base;
	}

	public has(perm: Permission): boolean {
		return (this.bits & perm) === perm;
	}
}
