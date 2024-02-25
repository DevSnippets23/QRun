export class Storage {
	#storage = new Map();

	/** @param {import('./queue.js').Queue} queue queue class */
	add(queue) {
		this.#storage.set(queue.uuid, queue);
	}

	/**
	 * @param {string} uuid uuid
	 * @returns {import('./queue.js').Queue} queue class
	 */
	get(uuid) {
		return this.#storage.get(uuid);
	}

	/** @returns {{[uuid: string]: import('./queue.js').Queue}} queues */
	getAll() {
		return Object.fromEntries(this.#storage.entries());
	}

	/**
	 * @param {string} uuid uuid
	 * @returns {boolean} true or false
	 */
	del(uuid) {
		return this.#storage.delete(uuid);
	}
}
