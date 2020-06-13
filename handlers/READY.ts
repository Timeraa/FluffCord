import { Client, User } from "../mod.ts";

export default function ready(this: Client, data: any) {
	this.user = new User(this, data.user);
	this.sessionId = data.session_id;
	this.unavailableGuilds = data.guilds;
}
