export class Collection<K, V> extends Map<K, V> {
	array(): V[] {
		return [...this.values()];
	}

	entryArray(): [K, V][] {
		return [...this.entries()];
	}

	keyArray(): K[] {
		return [...this.keys()];
	}

	map<T>(mapper: (item: V, index: number) => T): T[] {
		return this.array().map(mapper.bind(this));
	}

	flatMap<T>(mapper: (value: V, index: number, array?: V[]) => T): T[] {
		return this.array().flatMap(mapper.bind(this));
	}

	limit(i: number): Collection<K, V> {
		return new Collection(this.entryArray().slice(0, i));
	}

	skip(i: number): Collection<K, V> {
		return new Collection(this.entryArray().slice(i));
	}

	random(i: number = 1): V[] {
		const result: V[] = [],
			values = this.array();
		for (let j = 0; j < i; j++)
			result.push(values[Math.floor(Math.random() * values.length)]);
		return result;
	}

	randomKeys(i: number = 1): K[] {
		const result: K[] = [],
			keys = this.keyArray();
		for (let j = 0; j < i; j++)
			result.push(keys[Math.floor(Math.random() * keys.length)]);
		return result;
	}

	reduce<T>(
		accumulator: (prev: T, cur: V, index?: number) => T,
		initialValue?: T
	): T {
		let prev!: T;
		const values = this.array();
		if (initialValue) prev = initialValue;
		for (let i = 0; i < values.length; i++) {
			prev = accumulator(prev, values[i], i);
		}
		return prev;
	}

	find(f: (value: V, index?: number) => boolean): V | undefined {
		return this.array().find(f.bind(this));
	}

	findKey(f: (value: K, index?: number) => boolean): K | undefined {
		return this.keyArray().find(f.bind(this));
	}

	concat(...collections: Collection<K, V>[]): Collection<K, V> {
		const col = new Collection<K, V>();
		for (const merging of collections) {
			for (const [mergingKey, mergingValue] of merging.entries()) {
				col.set(mergingKey, mergingValue);
			}
		}
		return col;
	}
}
