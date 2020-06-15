import { Client, User } from "../mod.ts";

export default function (this: Client, data: any) {
	const guild = this.guilds.get(data.guild_id)!;

	let oldMember = guild.members.get(data.user.id)!,
		newMember = guild.members.get(data.user.id)!;

	//* Member not cached, therefore no need to emit update event
	if (!oldMember) return;

	newMember.roles = data.roles.map((r: string) => guild.roles.get(r)!);
	newMember.user = new User(this, data.user);
	newMember.nick = data.nick;
	newMember.premium_since = data.premium_since;

	guild.members.set(newMember.user.id, newMember);

	this.emit("guildMemberUpdate", oldMember, newMember);
}
