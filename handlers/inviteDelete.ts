import { Client, Invite } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit("inviteDelete", new Invite(this, data));
}
