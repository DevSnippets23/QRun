# QRun

QRun is a lightweight and easy-to-use Node.js library for managing queues efficiently.

## Installation

You can install the QRun library using npm:

```bash
npm install qrun
```

## Quick Guide

### Use in JavaScript

```js
import { qrun } from 'qrun';

const yourQueue = qrun.createQueue((params, done, stop) => {
	// ...your code

	const result = 'someresult';
	done(result);
});

yourQueue.setParams(1, 2, 3, 4, 5);
// or yourQueue.setParams([1, 2, 3, 4, 5]);

yourQueue.onDone((result) => {
	console.log(result);
});
yourQueue.onError((error) => {
	console.log(error);
});

yourQueue.stop();

yourQueue.whenFinalised(() => {
	console.log('end');
});
yourQueue.whenStopped(() => {
	console.log('stop');
});

// or

qrun.getActiveQueues();
qrun.stopQueue(yourQueue.uuid);
qrun.delAllQueues();
```

### Use in TypeScript

```ts
import { qrun } from 'qrun';

const yourQueue = qrun.createQueue<string, string>((params, done, stop) => {
	// ...your code

	const result = 'someresult';
	done(result);
});

yourQueue.onDone<string>((result) => {
	console.log(result);
});
yourQueue.onError<Error>((error) => {
	console.log(error);
});
```