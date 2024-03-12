import { Queue } from './queue.js';
import { QueueStorage } from './storages/queue.storage.js';
import { EventEmitter } from 'node:events';
import { ParamsStorage } from './storages/params.storage.js';

class QRun {
	#queueStorage;

	/** @param {QueueStorage} queueStorage storage */
	constructor(queueStorage) {
		this.#queueStorage = queueStorage;
	}

	/**
	 * @param {string} queueUUID uuid
	 * @returns {() => void} callback.
	 */
	#delete(queueUUID) {
		return () => {
			this.#queueStorage.delete(queueUUID);
		};
	}

	/**
	 * @param {import('../index.js').QRunCallback} callback callback
	 * @param {Record<string, any>} [options] options
	 * @returns {Queue} queue.
	 */
	createQueue(callback, options = { save: true }) {
		const queue = new Queue(new EventEmitter(), new ParamsStorage(), callback);
		if (options.save) {
			const deleteCallback = this.#delete(queue.uuid).bind(this);
			queue.whenStopped(deleteCallback);
			queue.whenFinalised(deleteCallback);
			this.#queueStorage.add(queue);
		}
		return queue;
	}

	/**
	 * @param {string} queueUUID uuid
	 * @returns {Queue|null} queue or null.
	 */
	getQueue(queueUUID) {
		const queue = this.#queueStorage.get(queueUUID);
		return queue || null;
	}

	/** @returns {Record<string, Queue>} queues object */
	getAllQueues() {
		return this.#queueStorage.entries;
	}

	/**
	 * @param {string} queueUUID uuid
	 * @returns {boolean} 'true' if the queue is stopped, 'false' if the queue is not found.
	 */
	stopQueue(queueUUID) {
		const queue = this.#queueStorage.get(queueUUID);
		return queue?.stop() || false;
	}

	/** @returns {void} */
	stopAllQueues() {
		const queues = this.#queueStorage.entries;
		for (const key in queues) {
			queues[key].stop();
		}
	}
}

export const qrun = new QRun(new QueueStorage());
