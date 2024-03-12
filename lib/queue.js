import { v4 } from 'uuid';
import { sleep } from './utils.js';

export class Queue {
	#uuid = v4();
	#eventEmitter;
	#paramsStorage;
	#flags = {
		stopped: false,
		processing: false,
		finish: false,
	};

	/**
	 * @param {import('node:events').EventEmitter} eventEmitter event emmiter
	 * @param {import('./storages/params.storage.js').ParamsStorage} paramsStorage params storage
	 * @param {import('../index.js').QRunCallback} callback callback
	 */
	constructor(eventEmitter, paramsStorage, callback) {
		this.#eventEmitter = eventEmitter;
		this.#paramsStorage = paramsStorage;
		this.#eventEmitter.on('add', async (params, { cooldown }) => {
			if (cooldown) {
				await sleep(cooldown);
			}
			if (this.#flags.stopped) {
				this.#eventEmitter.emit('stop');
				this.#eventEmitter.removeAllListeners();
				return;
			}
			try {
				await callback(params, this.#done.bind(this), this.#stop.bind(this));
			} catch (error) {
				this.#eventEmitter.emit('error', error);
			}
			this.#process();
		});
	}

	get uuid() {
		return this.#uuid;
	}

	/** @returns {void} */
	#process() {
		if (this.#paramsStorage.size) {
			const { params, options } = this.#paramsStorage.deleteFirst();
			this.#eventEmitter.emit('add', params, options);
		} else {
			this.#flags.processing = false;
			this.#final();
		}
	}

	/** @param {any} data any data */
	#done(data) {
		this.#eventEmitter.emit('done', data);
	}

	/** @returns {void} */
	#stop() {
		if (!this.#flags.stopped) {
			this.#flags.stopped = true;
		}
	}

	/** @returns {void} */
	#final() {}

	/**
	 * @param {any} params any params
	 * @param {import('../index.js').QRunQueueAddOptions} [options] options
	 * @returns {Queue} this
	 */
	add(params, options = {}) {
		if (!this.#flags.finish) {
			this.#paramsStorage.add({ params, options });
		}
		if (!this.#flags.processing) {
			this.#flags.processing = true;
			this.#process();
		}
		return this;
	}

	/** @returns {boolean} true or false */
	finishAdding() {
		if (!this.#flags.finish) {
			this.#flags.finish = true;
		}
		return true;
	}

	/** @returns {true} boolean */
	stop() {
		this.#stop();
		return true;
	}

	/**
	 * @param {import('../index.js').QRunDoneCallback} callback callback
	 * @returns {Queue} this
	 */
	onDone(callback) {
		this.#eventEmitter.on('done', callback);
		return this;
	}

	/**
	 * @param {import('../index.js').QRunErrorCallback} callback callback
	 * @returns {Queue} this
	 */
	onError(callback) {
		this.#eventEmitter.on('error', callback);
		return this;
	}

	/**
	 * @param {() => Promise<void> | void} callback callback
	 * @returns {Queue} this
	 */
	whenStopped(callback) {
		this.#eventEmitter.once('stop', callback);
		return this;
	}

	/**
	 * @param {() => Promise<void> | void} callback callback
	 * @returns {Queue} this
	 */
	whenFinalised(callback) {
		this.#eventEmitter.once('final', callback);
		return this;
	}
}
