export class Role {
	id = "";
	name = "";
	color = 0;
	hoist = false;
	position = 0;
	private bitSet = 0;
	managed = false;
	mentionable = false;

	constructor(data: any) {
		const roleKeys = Object.keys(data);
		for (let i = 0; i < roleKeys.length; i++) {
			if (roleKeys[i] === "permissions") this.bitSet = data.permissions;
			Reflect.set(this, roleKeys[i], data[roleKeys[i]]);
		}
	}

	// TODO: Role permissions
	get permissions() {
		return null;
	}
}
