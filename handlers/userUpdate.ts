import { Client, Message } from "../mod.ts";
import { User } from "../mod.ts";

export default function (this: Client, data: any) {
	this.emit("userUpdate", new User(this, data));
}
