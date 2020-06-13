import { Client } from "../Client.ts";
import { Collection } from "../Classes/Collection.ts";
import { GatewayPayload } from "../@types/GatewayPayload.ts";
import { cyan, rgb24 } from "https://deno.land/std/fmt/colors.ts";

import channelCreate from "./CHANNEL_CREATE.ts";
import channelDelete from "./CHANNEL_DELETE.ts";
import channelUpdate from "./CHANNEL_UPDATE.ts";
import guildCreate from "./GUILD_CREATE.ts";
import guildDelete from "./GUILD_DELETE.ts";
import guildEmojisUpdate from "./GUILD_EMOJIS_UPDATE.ts";
import guildRoleCreate from "./GUILD_ROLE_CREATE.ts";
import guildUpdate from "./GUILD_UPDATE.ts";
import messageCreate from "./MESSAGE_CREATE.ts";
import messageDelete from "./MESSAGE_DELETE.ts";
import messageReactionAdd from "./MESSAGE_REACTION_ADD.ts";
import messageReactionRemove from "./MESSAGE_REACTION_REMOVE.ts";
import messageReactionRemoveAll from "./MESSAGE_REACTION_REMOVE_ALL.ts";
import messageUpdate from "./MESSAGE_UPDATE.ts";
import ready from "./READY.ts";
import typingStart from "./TYPING_START.ts";
import voiceStateUpdate from "./VOICE_STATE_UPDATE.ts";

export class EventHandler {
	private handlers: Collection<String, Function> = new Collection();
	constructor(public client: Client) {}

	load() {
		this.handlers.set("CHANNEL_CREATE", channelCreate.bind(this.client));
		this.handlers.set("CHANNEL_DELETE", channelDelete.bind(this.client));
		this.handlers.set("CHANNEL_UPDATE", channelUpdate.bind(this.client));
		this.handlers.set("GUILD_CREATE", guildCreate.bind(this.client));
		this.handlers.set("GUILD_DELETE", guildDelete.bind(this.client));
		this.handlers.set(
			"GUILD_EMOJIS_UPDATE",
			guildEmojisUpdate.bind(this.client)
		);
		this.handlers.set("GUILD_ROLE_CREATE", guildRoleCreate.bind(this.client));
		this.handlers.set("GUILD_UPDATE", guildUpdate.bind(this.client));
		this.handlers.set("MESSAGE_CREATE", messageCreate.bind(this.client));
		this.handlers.set("MESSAGE_DELETE", messageDelete.bind(this.client));
		this.handlers.set(
			"MESSAGE_REACTION_ADD",
			messageReactionAdd.bind(this.client)
		);
		this.handlers.set(
			"MESSAGE_REACTION_REMOVE",
			messageReactionRemove.bind(this.client)
		);
		this.handlers.set(
			"MESSAGE_REACTION_REMOVE_ALL",
			messageReactionRemoveAll.bind(this.client)
		);
		this.handlers.set("MESSAGE_UPDATE", messageUpdate.bind(this.client));
		this.handlers.set("READY", ready.bind(this.client));
		this.handlers.set("TYPING_START", typingStart.bind(this.client));
		this.handlers.set("VOICE_STATE_UPDATE", voiceStateUpdate.bind(this.client));
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
