import { Client } from "../Client.ts";
import { Collection } from "../Classes/Collection.ts";
import { GatewayPayload } from "../@types/GatewayPayload.ts";
import { cyan, rgb24 } from "https://deno.land/std/fmt/colors.ts";

import channelCreate from "./channelCreate.ts";
import channelDelete from "./channelDelete.ts";
import channelUpdate from "./channelUpdate.ts";
import guildBanAdd from "./guildBanAdd.ts";
import guildBanRemove from "./guildBanRemove.ts";
import guildCreate from "./guildCreate.ts";
import guildDelete from "./guildDelete.ts";
import guildEmojisUpdate from "./guildEmojiUpdate.ts";
import guildMemberAdd from "./guildMemberAdd.ts";
import guildMemberRemove from "./guildMemberRemove.ts";
import guildMemberUpdate from "./guildMemberUpdate.ts";
import guildRoleCreate from "./guildRoleCreate.ts";
import guildRoleDelete from "./guildRoleDelete.ts";
import guildUpdate from "./guildUpdate.ts";
import inviteCreate from "./inviteCreate.ts";
import inviteDelete from "./inviteDelete.ts";
import messageCreate from "./messageCreate.ts";
import messageDelete from "./messageDelete.ts";
import messageReactionAdd from "./messageReactionAdd.ts";
import messageReactionRemove from "./messageReactionRemove.ts";
import messageReactionRemoveAll from "./messageReactionRemoveAll.ts";
import messageUpdate from "./messageUpdate.ts";
import ready from "./ready.ts";
import typingStart from "./typingStart.ts";
import userUpdate from "./userUpdate.ts";
import voiceStateUpdate from "./voiceStateUpdate.ts";
import guildRoleUpdate from "./guildRoleUpdate.ts";
import messageDeleteBulk from "./messageDeleteBulk.ts";

export class EventHandler {
	private handlers: Collection<String, Function> = new Collection();
	constructor(public client: Client) {}

	load() {
		this.handlers.set("CHANNEL_CREATE", channelCreate.bind(this.client));
		this.handlers.set("CHANNEL_DELETE", channelDelete.bind(this.client));
		this.handlers.set("CHANNEL_UPDATE", channelUpdate.bind(this.client));
		this.handlers.set("GUILD_BAN_ADD", guildBanAdd.bind(this.client));
		this.handlers.set("GUILD_BAN_REMOVE", guildBanRemove.bind(this.client));
		this.handlers.set("GUILD_CREATE", guildCreate.bind(this.client));
		this.handlers.set("GUILD_DELETE", guildDelete.bind(this.client));
		this.handlers.set(
			"GUILD_EMOJIS_UPDATE",
			guildEmojisUpdate.bind(this.client)
		);
		this.handlers.set("GUILD_MEMBER_ADD", guildMemberAdd.bind(this.client));
		this.handlers.set(
			"GUILD_MEMBER_REMOVE",
			guildMemberRemove.bind(this.client)
		);
		this.handlers.set(
			"GUILD_MEMBER_UPDATE",
			guildMemberUpdate.bind(this.client)
		);
		this.handlers.set("GUILD_ROLE_CREATE", guildRoleCreate.bind(this.client));
		this.handlers.set("GUILD_ROLE_DELETE", guildRoleDelete.bind(this.client));
		this.handlers.set("GUILD_ROLE_UPDATE", guildRoleUpdate.bind(this.client));
		this.handlers.set("INVITE_CREATE", inviteCreate.bind(this.client));
		this.handlers.set("INVITE_DELETE", inviteDelete.bind(this.client));
		this.handlers.set("GUILD_UPDATE", guildUpdate.bind(this.client));
		this.handlers.set("MESSAGE_CREATE", messageCreate.bind(this.client));
		this.handlers.set("MESSAGE_DELETE", messageDelete.bind(this.client));
		this.handlers.set(
			"MESSAGE_DELETE_BULK",
			messageDeleteBulk.bind(this.client)
		);
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
		this.handlers.set("USER_UPDATE", userUpdate.bind(this.client));
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
		}

		const handler = this.handlers.get(payload.t);

		if (!handler) return;

		await handler(payload.d);
	}
}
