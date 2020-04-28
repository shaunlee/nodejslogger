# Yet another logger for Node.js

## Install

```
$ yarn add https://github.com/shaunlee/nodejslogger
```

## Usage

```js
const log = require('nodejslogger');

log.debug('Hello World');
log.info('Hello World');
log.warn('Hello World');
log.error(new Error('Hello World'));
log.trace('Hello World');

// Options

log.colorize = true;
log.level = 'debug';
log.stdout = log.stderr = process.stdout;
```

## License

Licensed under [MIT](https://github.com/pinojs/pino/blob/master/LICENSE).
