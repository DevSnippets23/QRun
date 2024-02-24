import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';

export class Queue {
	#emitter = new EventEmitter();
	#stopped = false;

	/** @param {import('qrun').QRunCallback} callback callback */
	constructor(callback) {
		this.uuid = randomUUID();
		this.#emitter.once('params', async (args) => {
			for (const params of args) {
				if (this.#stopped) {
					break;
				}
				try {
					await callback(params, this.#done.bind(this), this.#stop.bind(this));
				} catch (error) {
					this.#emitter.emit('error', error);
				}
			}
			this.#emitter.emit('final');
			this.#emitter.removeAllListeners();
		});
	}

	/** @param {any} result any result */
	#done(result) {
		this.#emitter.emit('done', result);
	}

	/** @returns {void} */
	#stop() {
		this.#stopped = true;
		this.#emitter.emit('stop');
		this.#emitter.removeAllListeners();
	}

	/** @type {import('qrun').QRunSetParams} */
	setParams(...args) {
		if (args.length === 1 && Array.isArray(args[0])) {
			this.#emitter.emit('params', args[0]);
		} else {
			this.#emitter.emit('params', args);
		}
		return this;
	}

	/** @returns {void} */
	stop() {
		this.#stop();
	}

	/**
	 * @param {() => void | Promise<void>} callback callback
	 * @returns {Queue} this
	 */
	whenStopped(callback) {
		this.#emitter.once('stop', callback);
		return this;
	}

	/**
	 * @param {() => void | Promise<void>} callback callback
	 * @returns {Queue} this
	 */
	whenFinalised(callback) {
		this.#emitter.once('final', callback);
		return this;
	}

	/** @type {import('qrun').QRunOnDone} */
	onDone(callback) {
		this.#emitter.on('done', callback);
		return this;
	}

	/** @type {import('qrun').QRunOnError} */
	onError(callback) {
		this.#emitter.on('error', callback);
		return this;
	}
}
