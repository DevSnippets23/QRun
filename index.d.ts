declare module 'qrun' {
	export type QRunQueue = import('./lib/queue.js').Queue;

	export type QRunCallback<Params = any, Result = any> = (
		params: Params,
		done: (result: Result) => void,
		stop: () => void,
	) => void | Promise<void>;
	export type QRunCreateQueue = <Params = any, Result = any>(
		callback: QRunCallback<Params, Result>,
		options?: {
			save: boolean;
		},
	) => QRunQueue;

	export type QRunSetParams = <Params = any>(...params: Params[]) => QRunQueue;

	export type QRunDoneCallback<Result = any> = (result: Result) => void | Promise<void>;
	export type QRunOnDone = <Result = any>(callback: QRunDoneCallback<Result>) => QRunQueue;

	export type QRunErrorCallback<Error = unknown> = (error: Error) => void | Promise<void>;
	export type QRunOnError = <Error = unknown>(callback: QRunErrorCallback<Error>) => QRunQueue;

	export const qrun: typeof import('./lib/qrun.js').qrun;
}
