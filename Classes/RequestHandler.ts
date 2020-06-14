import { Client, Collection } from "../mod.ts";
import { red, cyan, magenta } from "https://deno.land/std/fmt/colors.ts";
import ShortUniqueId from "https://deno.land/x/short_uuid/mod.ts";
import { DISCORD_API_BASE } from "../constants.ts";
const uid = new ShortUniqueId();

//TODO Handle Global Ratelimit
export class RequestHandler {
	client: Client;
	currentGlobalRateLimit = 0;
	routeLimitReset: Collection<string, any> = new Collection();
	pendingRequests: Collection<
		string,
		{
			id: string;
			resolve: any;
			reject: any;
			method: string;
			path: string;
			body: any;
		}[]
	> = new Collection();

	constructor(client: Client) {
		this.client = client;
	}

	request(
		method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH",
		path: string,
		body: any = null,
		requestId = ""
	) {
		return new Promise(async (resolve, reject) => {
			let pendingRequests = this.pendingRequests.get(path) || [];

			if (requestId === "") {
				requestId = uid();

				pendingRequests.push({
					id: requestId,
					resolve,
					reject,
					method,
					path,
					body
				});
				this.pendingRequests.set(path, pendingRequests);
			}

			let data: RequestInit = {
				body,
				method,
				headers: new Headers({
					Authorization: `Bot ${this.client.options.token}`,
					"Content-Type": "application/json"
				})
			};

			if (data.body === null) delete data.body;
			else data.body = JSON.stringify(data.body);
			if (this.client.options.debugRequests) {
				// @ts-ignore
				this.client.debugLog(
					`${magenta(method)} ${cyan(path.startsWith("/") ? path : `/${path}`)}`
				);
			}

			const start = performance.now(),
				res = await fetch(DISCORD_API_BASE + path, data);
			this.client.metrics.addResponseTime(performance.now() - start);

			//* Too many requests
			if (res.status === 429) {
				if (!this.routeLimitReset.has(path)) {
					this.client.metrics.putFailedRequest(
						path.startsWith("/") ? path : `/${path}`
					);
					// @ts-ignore
					this.client.debugLog(
						red(
							`${method} ${path} hit ratelimit, retry in ${res.headers.get(
								"X-RateLimit-Reset-After"
							)} seconds.`
						)
					);

					this.routeLimitReset.set(path, {
						timeout: setTimeout(
							() => this.rateLimitExpired(path),
							parseInt(res.headers.get("X-RateLimit-Reset-After")!) * 1000
						),
						limit: res.headers.get("X-RateLimit-Limit")
					});
				}

				return;
			}

			pendingRequests = this.pendingRequests.get(path) || [];

			const response = res.status !== 204 ? await res.json() : null,
				request = pendingRequests.find(pR => pR.id === requestId);

			if (!res.ok) {
				this.client.metrics.putFailedRequest(
					path.startsWith("/") ? path : `/${path}`
				);

				request?.reject(response);
				reject(response);
			} else {
				this.client.metrics.putRequest(
					path.startsWith("/") ? path : `/${path}`
				);
				resolve(response);
				request?.resolve(response);
			}

			pendingRequests = pendingRequests.filter(pR => pR.id !== requestId);
			this.pendingRequests.set(path, pendingRequests);
		});
	}

	rateLimitExpired(path: string) {
		let pendingRequests = this.pendingRequests.get(path);

		this.routeLimitReset.delete(path);

		pendingRequests?.map(r =>
			//@ts-ignore
			this.request(r.method, r.path, r.body, r.id)
		);
	}
}
