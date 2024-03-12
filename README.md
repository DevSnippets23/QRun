# QRun

[![npm](https://img.shields.io/npm/v/qrun.svg?maxAge=1000)](https://www.npmjs.com/package/qrun)
[![npm](https://img.shields.io/npm/dt/qrun.svg?maxAge=1000)](https://www.npmjs.com/package/qrun)
[![npm](https://img.shields.io/npm/l/qrun.svg?maxAge=1000)](https://github.com/DevSnippets23/QRun/blob/main/LICENSE)

Lightweight and easy-to-use JavaScript library for managing queues efficiently.

# Table of Contents

- [QRun](#qrun)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
	- [QRun object](#qrun-object)
		- [createQueue()](#createqueue)
		- [getQueue()](#getqueue)
		- [getAllQueues()](#getallqueues)
		- [stopQueue()](#stopqueue)
		- [stopAllQueues()](#stopallqueues)
	- [Queue object](#queue-object)
		- [uuid](#uuid)
		- [add()](#add)
		- [finishAdding()](#finishadding)
		- [stop()](#stop)
		- [onDone()](#ondone)
		- [onError()](#onerror)
		- [whenStopped()](#whenstopped)
		- [whenFinalised()](#whenfinalised)
- [Contributing](#contributing)
- [Author](#author)

# Installation

Install with `npm`

```
npm install qrun
```

# Usage

`JavaScript`

```javascript
import { qrun } from 'qrun';

const queue = qrun.createQueue((params, done, stop) => {
	if (params === 5) {
		throw new Error('error 5');
	}
	if (params === 7) {
		return stop();
	}
	done(params);
});

for (let i = 0; i < 10; i++) {
	queue.add(i, { cooldown: 100 });
}

queue.finishAdding(); // optional

queue.onDone(console.log);
queue.onError(console.error);

queue.whenFinalised(() => console.log('end'));
queue.whenStopped(() => console.log('stopped'));

console.log(qrun.getAllQueues());
console.log(qrun.getQueue(queue.uuid));
```

`TypeScript`

```typescript
import { qrun } from 'qrun';

const queue = qrun.createQueue<number, number, Error>((params, done, stop) => {
	if (params === 5) {
		throw new Error('error 5');
	}
	if (params === 7) {
		return stop();
	}
	done(params);
});
```

# API

## QRun object

### createQueue()

Creates a new QRun queue.

Args:

- `callback(params, done, stop)`: A callback that will execute `QRun` while the queue is executing.
- `options`:
	- `options.save`: Enable or disable queue saving in `QRun` storage. Default 'true'.
	The following methods of the [QRun object](#qrun-object) will not work if saving is disabled.

### getQueue()

Get queue by [uuid](#uuid).

Args:

- `queueUUID`: queue [uuid](#uuid).

### getAllQueues()

Get all queues.

### stopQueue()

Stop queue by [uuid](#uuid).

### stopAllQueues()

Stop all queues.

## Queue object

### uuid

Unique queue identifier. Required for working with `QRun` storage.

### add()

Adding parameters to perform a queue callback.

Args:

- `params`: Any data. String, Object, etc.
- `options`:
	- `options.cooldown`: Setting an artificial delay in milliseconds for queue execution. Optional.

### finishAdding()

Finish adding parameters. After calling this method, you can no longer add new parameters. When the execution of the last added parameter is complete, the [whenFinalised()](#whenFinalised) callback will be triggered.

### stop()

Stop queue.

### onDone()

Listen for `done()` events.

Args:

- `callback(data)`: A callback that will execute `QRun` while calling the done() method in [createQueue() callback](#createqueue).

### onError()

Catching errors.

Args:

- `callback(error)`: A callback that will execute `QRun` during an error.

### whenStopped()

Listening for a `stop' event. It is triggered only once.

Args:

- `callback()`: A callback that will execute `QRun` while calling the stop() method in [createQueue() callback](#createqueue).

### whenFinalised()

Listening for a `final' event. It is triggered only once.

Args:

- `callback()`: A callback that will only execute `QRun` after calling [finishAdding()](#finishadding).

# Contributing

Clone repo, run npm install to install all dependencies.

Thank you for considering contributing. :)

# Author

DevSnippets - [@devsnippets](https://t.me/devsnippets)