import { Permissions, Guild } from "../mod.ts";

export class Role {
	id = "";
	name = "";
	color = 0;
	hoist = false;
	position = 0;
	bitSet = 0;
	managed = false;
	mentionable = false;
	guild: Guild;

	constructor(guild: Guild, data: any) {
		this.guild = guild;

		const keys = Object.keys(data);

		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case "permissions":
					this.bitSet = data.permissions;
					break;
				default:
					Reflect.set(this, keys[i], data[keys[i]]);
					break;
			}
		}
	}

	// TODO: Role permissions
	get permissions() {
		return new Permissions(null, this);
	}
}
