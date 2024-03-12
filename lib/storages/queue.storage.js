export class QueueStorage extends Map {
	/** @returns {Record<string, import('../queue.js').Queue>} queues */
	get entries() {
		return Object.fromEntries(super.entries());
	}

	/** @param {import('../queue.js').Queue} queue queue */
	add(queue) {
		this.set(queue.uuid, queue);
	}
}
