/**
 * I wanted to see how much faster a computation runs synchronously,
 *  using process.nextTick, setTimeout.
 * Granted, this will depend greatly on what /other/ things are also running
 *  on the machine at the same time; any action that blocks the process will
 *  block asynchronous actions, including GC.
 */

var Benchmark = require('benchmark');

(new Benchmark.Suite).add('sync computation', function () {
  const value = 1;
  const value2 = value + 1;
}).add('setTimeout async computation', function () {
  const value = 1;
  setTimeout(function () {
    const value2 = value + 1;
  }, 0);
}).add('nextTick async computation', function () {
  const value = 1;
  process.nextTick(function () {
    const value2 = value + 1;
  });
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: true });
