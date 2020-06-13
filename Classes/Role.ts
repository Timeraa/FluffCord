export default class Role {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	private bitSet: number;
	managed: boolean;
	mentionable: boolean;

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
