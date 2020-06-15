import { ClientOptions } from "./@types/ClientOptions.ts";
import { Collection } from "./Classes/Collection.ts";
import { EventHandler } from "./handlers/_loader.ts";
import { GatewayPayload } from "./@types/GatewayPayload.ts";
import { Guild, UnavailableGuild } from "./Classes/Guild.ts";
import { Metrics } from "./Classes/Metrics.ts";
import { RequestHandler } from "./Classes/RequestHandler.ts";
import { User } from "./Classes/User.ts";
import { DISCORD_GATEWAY_URL } from "./constants.ts";

import {
	connectWebSocket,
	isWebSocketCloseEvent,
	WebSocket,
	WebSocketCloseEvent
} from "https://deno.land/std/ws/mod.ts";
import * as colors from "https://deno.land/std/fmt/colors.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";
import { process } from "https://deno.land/std/node/process.ts";

export class Client extends EventEmitter {
	ws: WebSocket | null = null;
	unavailableGuilds: UnavailableGuild[] = [];
	sessionId: string | null = null;
	options: ClientOptions;
	guilds: Collection<string, Guild> = new Collection();
	metrics: Metrics = new Metrics();
	ready = false;
	user: User | null = null;
	requesthandler = new RequestHandler(this);
	private interval?: number;
	private seq: number = 0;
	private lastHeartbeat: number = -1;
	private lastHeartbeatAck: number = -1;
	private eventHandler = new EventHandler(this);
	private connected = false;

	constructor(options: ClientOptions) {
		super();
		this.options = options;
	}

	async request(path: string, method: string, body: any = null): Promise<any> {
		// @ts-ignore
		return this.requesthandler.request(method, path, body);
	}

	async login() {
		return new Promise(async (resolve, reject) => {
			const now = Date.now();

			//* Load all events
			await this.eventHandler.load();

			this.ws = await connectWebSocket(DISCORD_GATEWAY_URL);
			for await (const message of this.ws) {
				if (typeof message === "string") {
					if (!this.connected) {
						const difference = Date.now() - now;
						this.debugLog(
							colors.green(
								`WS connected (${
									difference < 500
										? difference
										: difference < 1000
										? colors.yellow(difference.toString())
										: colors.red(difference.toString())
								}ms)!`
							)
						);
						resolve();
						this.connected = true;
					}

					await this.handle(JSON.parse(message));
				} else if (isWebSocketCloseEvent(message)) {
					this.ready = false;
					this.connected = false;
					this.handleDisconnect(message, reject);
				}
			}
		});
	}

	private debugLog(...message: string[]) {
		if (this.options.debug)
			console.log(
				colors.white(colors.bold("FluffCord")),
				colors.cyan("-"),
				message.join(" ")
			);
	}

	private heartbeat() {
		this.lastHeartbeat = Date.now();
		this.ws?.send(
			JSON.stringify({
				op: 1,
				d: this.seq ? this.seq : null
			} as GatewayPayload)
		);
	}

	private identify() {
		this.ws?.send(
			JSON.stringify({
				op: 2,
				d: {
					token: this.options.token,
					properties: {
						$os: process.platform,
						$browser: "FluffCord",
						$device: "FluffCord"
					}
				}
			} as GatewayPayload)
		);
	}

	private async handle(payload: GatewayPayload) {
		switch (payload.op) {
			//* Dispatch
			case 0: {
				this.emit("raw", payload);
				await this.eventHandler.dispatch(payload);
				break;
			}
			//* Hello
			case 10: {
				this.debugLog(
					colors.magenta(`Heartbeating at ${payload.d.heartbeat_interval}ms!`)
				);
				this.heartbeat();
				this.identify();
				this.interval = setInterval(
					this.heartbeat.bind(this),
					payload.d.heartbeat_interval
				);
				break;
			}
			//* Heartbeat ACK
			case 11: {
				this.lastHeartbeatAck = Date.now();

				const difference = this.lastHeartbeatAck - this.lastHeartbeat;
				this.debugLog(
					colors.magenta(
						`Received a heartbeat ACK, which took ${
							difference < 500
								? colors.green(difference.toString())
								: difference < 1000
								? colors.yellow(difference.toString())
								: colors.red(difference.toString())
						}ms!`
					)
				);
				break;
			}
			//* Reconnect
			case 7: {
				if (payload.d) {
					this.resume();
				} else {
					this.reconnect();
				}
			}
		}
	}

	private handleDisconnect(
		message: WebSocketCloseEvent,
		reject: (reason?: any) => void
	) {
		switch (message.code) {
			//* Custom discord close codes
			case 4003:
				return reject(
					"A payload was sent before the client could successfully identify!"
				);
			case 4004:
				return reject("Invalid token provided!");
			case 4005:
				return reject(
					"We've already sent an identify payload! Did you send another one?"
				);
			case 4008:
			case 4009:
				return this.reconnect();
			case 4011:
				return reject(
					"This client would have been handling too many guilds! Please increase the shard limit!"
				);
			case 4013:
				return reject("An invalid intent was provided");
			case 4014:
				return reject(
					"You specified an intent in which your client doesn't have access to!"
				);
			//* Standard close codes
			case 1000:
				return this.emit("disconnect", 1000, "Normal closure");
			case 1005:
				return this.emit("disconnect", 1005, "No status received");
			case 1006:
				return this.emit(
					"disconnect",
					1006,
					"Connection reset on behalf of server"
				);
			default:
				return this.emit("disconnect", message.code, message.reason || "N/A");
		}
	}

	private resume() {
		this.debugLog(`Client is resuming with sequence ${this.seq}...`);
		this.emit("resuming");
		this.ws?.send(
			JSON.stringify({
				op: 6,
				d: {
					token: this.options.token,
					session_id: this.sessionId,
					seq: this.seq
				}
			})
		);
	}

	private reconnect() {
		this.debugLog("Client is reconnecting...");
		this.emit("reconnecting");
		this.guilds.clear();
		this.seq = 0;
		clearInterval(this.interval);
		this.lastHeartbeat = -1;
		this.lastHeartbeatAck = -1;
		this.unavailableGuilds = [];
		this.sessionId = null;
		this.ws?.close();
		this.identify();
	}

	get ping() {
		return this.lastHeartbeatAck - this.lastHeartbeat;
	}
}
