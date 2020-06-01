import { DISCORD_GATEWAY_URL } from "./constants.ts";
import {
	connectWebSocket,
	isWebSocketCloseEvent,
	isWebSocketPingEvent,
	isWebSocketPongEvent,
	WebSocket
} from "https://deno.land/std/ws/mod.ts";
import EventEmitter from "https://deno.land/x/event_emitter/mod.ts";
import { blue, green, red, yellow } from "https://deno.land/std/fmt/colors.ts";

interface ClientOptions {
	/**
	 * Discord Bot token
	 */
	token: string;
	/**
	 * Wherever to log internal issues
	 */
	debug: boolean;
}

export default class Client extends EventEmitter {
	private ws: WebSocket | null = null;
	private options: ClientOptions;

	constructor(options: ClientOptions) {
		super();

		this.options = options;
	}

	async login() {
		this.ws = await connectWebSocket(DISCORD_GATEWAY_URL);
	}
}
