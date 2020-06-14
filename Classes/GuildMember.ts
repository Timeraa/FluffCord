import { Client, User, Role, Guild, Permissions } from "../mod.ts";

export class GuildMember {
	user: User;
	nick: null | string;
	roles: Role[];
	joined_at: Date;
	premium_since: null | number;
	hoisted_role: Role;
	mute: boolean;
	deaf: boolean;

	constructor(client: Client, public guild: Guild, member: any) {
		this.user = new User(client, member.user);
		this.roles = member.roles.map((r: string) => guild.roles.get(r));
		this.nick = member.nick || null;
		this.joined_at = new Date(member.joined_at);
		this.premium_since = member.premium_since
			? new Date(member.premium_since).getTime()
			: null;
		this.hoisted_role = guild.roles.get(member.hoisted_role)!;
		this.deaf = member.deaf;
		this.mute = member.mute;
	}

	get permissions() {
		return new Permissions(this.guild, null, null, this);
	}
}
