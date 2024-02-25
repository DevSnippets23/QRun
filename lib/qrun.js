import { Queue } from './queue.js';
import { Storage } from './storage.js';

class QRun {
	#queueStorage = new Storage();

	/**
	 * @param {string} queueUUID queue uuid
	 * @returns {() => void} callback
	 */
	#del(queueUUID) {
		return () => {
			this.#queueStorage.del(queueUUID);
		};
	}

	/** @type {import('qrun').QRunCreateQueue} */
	createQueue(callback, options = { save: true }) {
		const queue = new Queue(callback);
		if (options.save) {
			const deleteCallback = this.#del(queue.uuid).bind(this);
			queue.whenStopped(deleteCallback);
			queue.whenFinalised(deleteCallback);
			this.#queueStorage.add(queue);
		}
		return queue;
	}

	/**
	 * @param {string} queueUUID queue uuid
	 * @returns {import('qrun').QRunQueue | null} queue or null
	 */
	getQueue(queueUUID) {
		const queue = this.#queueStorage.get(queueUUID);
		return queue || null;
	}

	/** @returns {{[uuid: string]: import('./queue.js').Queue}} queues */
	getActiveQueues() {
		return this.#queueStorage.getAll();
	}

	/**
	 * @param {string} queueUUID queue uuid
	 * @returns {boolean} true or false
	 */
	stopQueue(queueUUID) {
		const queue = this.#queueStorage.get(queueUUID);
		if (queue) {
			queue.stop();
			return true;
		}
		return false;
	}

	/** @returns {void} */
	stopAllQueues() {
		const queues = this.#queueStorage.getAll();
		for (const key in queues) {
			queues[key].stop();
		}
	}
}

export const qrun = new QRun();
