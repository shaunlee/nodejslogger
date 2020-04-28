const os = require('os');
const Emitter = require('events');
const stream = require('stream');

const LEVELS = ['trace', 'error', 'warn', 'info', 'debug'];

const COLORS = {
  trace: '90',
  error: '31',
  warn: '33',
  info: '32',
  debug: '36',
  args: '36',
};

module.exports = {
  colorize: process.env.NODE_ENV !== 'production',
  level: 'debug',
  stdout: process.stdout,
  stderr: process.stderr,
};

function colorize(s, color) {
  if (!module.exports.colorize) return s;
  if (module.exports.stdout !== process.stdout) return s;
  return ['\033[', color, 'm', s, '\033[0m'].join('');
}

function parseArgs(args) {
  return args.map(e => {
    if (e === null || e === undefined) return '';
    if (e instanceof stream.Readable) return '<stream>';
    if (e instanceof Buffer) return '<buffer>';
    if (e instanceof Error) return e.stack || e.toString();
    if (typeof e === 'object') return JSON.stringify(e);
    return e.toString();
  }).filter(e => !!e).join(' ');
}

const ev = new Emitter;

// [ISO Date] LEVEL (hostname): xxx
ev.on('logging', (level, ...args) => {
  if (LEVELS.indexOf(level) > LEVELS.indexOf(module.exports.level)) return;

  (level === 'error' ? module.exports.stderr : module.exports.stdout).write([
    '[', new Date().toISOString(), '] ',
    colorize((level.toUpperCase() + ' ').substring(0, 5), COLORS[level]),
    ' (', os.hostname(), '): ',
    colorize(parseArgs(args), level === 'error' ? COLORS.error : COLORS.args),
    '\n',
  ].join(''));
});

LEVELS.forEach(level => (
  module.exports[level] = async (...args) => ev.emit('logging', level, ...args)
));

if (!module.parent) {
  // module.exports.colorize = false;
  // module.exports.level = 'error';
  const max = 10000;
  // const begin = Date.now();
  let i = 0;
  while (i < max) {
    module.exports[LEVELS[Math.floor(Math.random() * LEVELS.length)]](
      1024, 'Hello World', 3.1415926, {ok: true}, [1,0,2,4], Buffer.from('1024')
    );
    i++;
  }
  // const end = Date.now();
  module.exports.error(new Error('Something wrong!'));
  // module.exports.debug(end - begin, (end - begin) / max);
}
