/**
 * How much slower is it to store a Date and use Date.getTime() than to just
 * store the unix timestamp offset?
 */

var Benchmark = require('benchmark');

const dateAry = [new Date()];
const tsAry = [Date.now()];

(new Benchmark.Suite).add('use getTime', function () {
  dateAry[0].getTime();
}).add('just access an array with timestamps directly', function () {
  tsAry[0];
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
