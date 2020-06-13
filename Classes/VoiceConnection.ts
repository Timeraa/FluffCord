import { GatewayPayload, VoiceState } from "../mod.ts";
import {
	connectWebSocket,
	isWebSocketCloseEvent,
	WebSocket
} from "https://deno.land/std/ws/mod.ts";

export class VoiceConnection {
	//@ts-ignore
	ws: WebSocket;
	// udpSock: Deno.Listener;
	endpoint = "";
	token = "";
	private secretKey: number[] = [];
	private udpIp = "";
	private udpPort = 0;
	private userUDPAddr = "";
	private userUDPPort = 0;
	//@ts-ignore
	private resolve: Function;
	//@ts-ignore
	private reject: Function;
	private interval = 0;
	//@ts-ignore
	private state: VoiceState;
	private data: any;

	async connect(state: VoiceState, data: any) {
		this.state = state;
		this.data = data;
		this.ws = await connectWebSocket(
			`wss://${data.endpoint.replace(":80", "")}?v=4`
		);
		return new Promise(async (resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			for await (const m of this.ws) {
				if (typeof m === "string") {
					await this.handle(JSON.parse(m));
				} else if (isWebSocketCloseEvent(m)) {
					//console.log(m.code, m.reason);
				}
			}
		});
	}
	private heartbeat(interval: number) {
		this.ws.send(JSON.stringify({ op: 8, d: Date.now() }));
	}
	private identify() {
		this.ws.send(
			JSON.stringify({
				op: 0,
				d: {
					server_id: this.state.guild_id,
					user_id: this.state.user_id,
					session_id: this.state.session_id,
					token: this.data.token
				}
			})
		);
	}
	private async handle(payload: GatewayPayload) {
		switch (payload.op) {
			case 8: {
				this.identify();
				setInterval(
					this.heartbeat.bind(this, payload.d.heartbeat_interval),
					payload.d.heartbeat_interval
				);
				break;
			}
			// case 2: {
			// 	// @ts-ignore
			// 	this.udpSock = Deno.listen({
			// 		hostname: "golang.org",
			// 		port: 80,
			// 		// @ts-ignore
			// 		transport: "udp"
			// 	});
			// 	for await (const m of this.udpSock) console.log(m);
			// 	console.log(this.udpSock);
			// }
		}
	}
}
