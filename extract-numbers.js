/**
 * I wanted to see how much faster/slower it is to `.slice` versus
 *  using regex to do something simple, which is my usual crutch.
 */

var Benchmark = require('benchmark');

const str = '001122.345';

(new Benchmark.Suite).add('3 tokens: regex match', function () {
  str.match(/^([0-9]{2})([0-9]{2})([0-9]{2}\.[0-9]{3})$/);
}).add('3 tokens: slice', function () {
  str.slice(0, 2);
  str.slice(2, 4);
  str.slice(4, 10);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('1 token: regex match', function () {
  str.match(/^([0-9]{2})/);
}).add('1 token: slice', function () {
  str.slice(0, 2);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
