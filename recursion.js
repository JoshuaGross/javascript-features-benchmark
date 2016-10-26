/**
 * Test a simple accumulation function: one them uses recursion, one uses iteration.
 */

const Benchmark = require('benchmark');
const str = '1234567890abcdefghijklmnop';

(new Benchmark.Suite).add('recursion', function () {
  chopRecursion(str);
}).add('iteration', function () {
  chopIteration(str);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

function chopRecursion (k) {
  if (k.length < 2) {
    return [];
  }
  const s = k.slice(0, -1);
  return [s].concat(chopRecursion(s));
}

function chopIteration (s) {
  const result = [];
  for (let i = 0; i < s.length; i++){
    result.push(s.slice(0, s.length - i));
  }
  return result;
}
