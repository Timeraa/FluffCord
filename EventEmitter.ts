export type HandlerFunction = (...args: any[]) => void;

export class EventEmitter {
	private _handlers: { [x: string]: HandlerFunction[] } = {};
	private max: number = 10;

	on(event: string, callback: HandlerFunction) {
		let handlers = this._handlers[event];
		if (!handlers) handlers = this._handlers[event] = [callback];
		else {
			if (handlers.length > this.max) return;
			handlers = this._handlers[event] = handlers.concat(callback);
		}
	}

	once(event: string, callback: HandlerFunction) {}

	private _wrap(event: string, original: HandlerFunction): HandlerFunction {
		const wrapped = (...args: any[]): void => {
			this._handlers[event].splice(this._handlers[event].indexOf(original, 1));
			original.apply(this, args);
		};
		return wrapped;
	}
}
