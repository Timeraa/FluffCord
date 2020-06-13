import { Collection } from "../mod.ts";

export class Metrics {
	private receivedEvents: Collection<string, number> = new Collection();
	private requests: Collection<string, number> = new Collection();
	private failedRequests: Collection<string, number> = new Collection();
	private responseTimes: number[] = [];

	putReceivedEvent(type: string) {
		const count = this.receivedEvents.has(type)
			? this.receivedEvents.get(type)! + 1
			: 1;
		this.receivedEvents.set(type, count);
	}

	totalReceivedEvents(from?: string): number {
		return from
			? this.receivedEvents.get(from) || 0
			: [...this.receivedEvents.values()].reduce((x, y) => x + y);
	}

	putRequest(path: string) {
		const count = this.requests.has(path) ? this.requests.get(path)! + 1 : 1;
		this.requests.set(path, count);
	}

	totalRequests(from?: string): number {
		return from
			? this.requests.get(from) || 0
			: [...this.requests.values()].reduce((x, y) => x + y);
	}

	putFailedRequest(path: string) {
		const count = this.failedRequests.has(path)
			? this.failedRequests.get(path)! + 1
			: 1;
		this.failedRequests.set(path, count);
	}

	totalFailedRequests(from?: string): number {
		return from
			? this.failedRequests.get(from) || 0
			: [...this.failedRequests.values()].reduce((x, y) => x + y);
	}

	addResponseTime(time: number) {
		this.responseTimes.push(time);
	}

	avgResponseTime() {
		return (
			this.responseTimes.reduce((x, y) => x + y) / this.responseTimes.length
		);
	}
}
