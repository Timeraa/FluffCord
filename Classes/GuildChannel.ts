import {
	Guild,
	Client,
	PermissionOverwrite,
	Permissions,
	GuildMember,
	Invite
} from "../mod.ts";

export class GuildChannel {
	//@ts-ignore
	client: Client;
	id = "";
	type = 0;
	position = 0;
	permission_overwrites: PermissionOverwrite[] = [];
	name = "";
	//@ts-ignore
	guild: Guild;

	constructor(guild: Guild, data: any) {
		this.client = guild.client;

		const keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "guild_id":
					this.guild = guild;
					break;
				case "id":
					this.id = data.id;
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}

	async createInvite(
		options: {
			max_age: number;
			max_uses: number;
			temporary: boolean;
			unique: boolean;
		} = { max_age: 86400, max_uses: 0, temporary: false, unique: false }
	) {
		return this.client
			.request(`channels/${this.id}/invites`, "POST", options)
			.then(data => new Invite(this.client, data))
			.catch(err => {
				throw `${err.code} - ${err.message}`;
			});
	}

	async delete() {
		return this.client.request(`channels/${this.id}`, "DELETE").catch(err => {
			throw `${err.code} - ${err.message}`;
		});
	}

	permissionsFor(member: GuildMember) {
		return new Permissions(this.guild, null, this, member);
	}
}
