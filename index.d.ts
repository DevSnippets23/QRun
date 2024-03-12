declare type QRunCallback<Params = any, Result = any> = (
	params: Params,
	done: (result: Result) => void,
	stop: () => void,
) => Promise<void> | void;

declare interface QRunOptions {
	save: boolean;
}

declare class QRun {
	/**
	 * Creates a new QRun queue
	 * @param callback a callback that will execute `QRun` while the queue is executing
	 * @param options options
	 * @param options.save Enable or disable queue saving in `QRun` storage. Default 'true'
	 * @returns {Queue} queue object
	 */
	createQueue<Params = any, Result = any, Error = unknown>(
		callback: QRunCallback<Params, Result>,
		options?: QRunOptions,
	): Queue<Params, Result, Error>;

	/**
	 * Get queue by uuid
	 * @param queueUUID queue uuid
	 */
	getQueue(queueUUID: string): Queue | null;

	/** Get all queues */
	getAllQueues(): Record<string, Queue>;

	/**
	 * Stop queue by uuid
	 * @param queueUUID queue uuid
	 */
	stopQueue(queueUUID: string): boolean;

	/** Stop all queues */
	stopAllQueues(): void;
}

declare interface QRunQueueAddOptions {
	cooldown: number;
}

declare type QRunDoneCallback<Result = any> = (data: Result) => Promise<void> | void;
declare type QRunErrorCallback<Error = unknown> = (error: Error) => Promise<void> | void;

declare class Queue<QueueParams = any, QueueResult = any, QueueError = any> {
	/** Unique queue identifier. Required for working with `QRun` storage */
	uuid: string;

	/**
	 * Adding parameters to perform a queue callback
	 * @param params
	 * @param options
	 */
	add<Params = QueueParams>(params: Params, options?: QRunQueueAddOptions): void;

	/**
	 * Finish adding parameters.
	 * After calling this method, you can no longer add new parameters.
	 * When the execution of the last added parameter is complete, the `whenFinalised()` callback will be triggered.
	 */
	finishAdding(): true;

	/** Stop queue */
	stop(): true;

	/**
	 * Listen for `done()` events
	 * @param callback a callback that will execute `QRun` while calling the done() method in `createQueue()` callback
	 */
	onDone<Result = QueueResult>(callback: QRunDoneCallback<Result>): void;

	/**
	 * Catching errors
	 * @param callback a callback that will execute `QRun` during an error
	 */
	onError<Error = QueueError>(callback: QRunErrorCallback<Error>): void;

	/**
	 * Listening for a `stop' event. It is triggered only once
	 * @param callback a callback that will execute `QRun` while calling the stop() method in `createQueue()` callback
	 */
	whenStopped(callback: () => Promise<void> | void): void;

	/**
	 * Listening for a `final' event. It is triggered only once
	 * @param callback a callback that will only execute `QRun` after calling `finishAdding()`
	 */
	whenFinalised(callback: () => Promise<void> | void): void;
}

export const qrun: QRun;
