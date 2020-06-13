import { Client } from "../Client.ts";
import { Collection } from "../Classes/Collection.ts";
import { GatewayPayload } from "../@types/GatewayPayload.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { cyan, rgb24 } from "https://deno.land/std/fmt/colors.ts";

export class EventHandler {
	private handlers: Collection<String, Function> = new Collection();
	constructor(public client: Client) {}

	async load() {
		if (this.handlers.size > 0) return;

		for await (const f of walk("./handlers") as AsyncIterable<any>) {
			if (
				!f.isFile ||
				!f.name.endsWith(".ts") ||
				["_loader.ts", "index.ts"].includes(f.name)
			)
				continue;

			const temp = await import(`./${f.name}`);

			if (!temp.default || typeof temp.default !== "function") return;
			this.handlers.set(f.name.split(".")[0], temp.default.bind(this.client));
		}
	}

	async dispatch(payload: GatewayPayload) {
		if (!payload.t) return;
		this.client.metrics.putReceivedEvent(payload.t);
		if (
			!this.client.options.omittedDebugEvents?.includes(payload.t) &&
			this.client.options.debug
		) {
			if (!(!this.client.ready && payload.t === "GUILD_CREATE"))
				//@ts-ignore
				this.client.debugLog(
					rgb24(`Emit ${cyan(payload.t)}`, { r: 255, g: 255, b: 0 })
				);
			// @ts-ignore
			/* 			console.log(this.client.metrics.receivedEvents);
			 */
		}

		const handler = this.handlers.get(payload.t);

		if (!handler) return;

		await handler(payload.d);
	}
}
