import Client from "../Client.ts";
import User from "../Classes/User.ts";

export default async function ready(this: Client, data: any) {
	this.user = new User(this, data.user);
	this.sessionId = data.session_id;
	this.unavailableGuilds = data.guilds;
}
