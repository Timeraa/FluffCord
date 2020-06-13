import { Emoji, Guild, GuildMember, User } from "../mod.ts";

export class Reaction {
	count = 0;
	me = false;
	//@ts-ignore
	emoji: Emoji;
	//@ts-ignore
	user: User;
	member?: GuildMember;

	constructor(guild: Guild, data: any) {
		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "emoji":
					this.emoji = new Emoji(guild, data.emoji);
					break;
				case "user_id":
					this.member = guild.members.get(data.user_id);
					this.user = this.member!.user!;
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}
}
