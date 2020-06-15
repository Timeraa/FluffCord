import { Client, Invite } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit("inviteCreate", new Invite(this, data));
}
