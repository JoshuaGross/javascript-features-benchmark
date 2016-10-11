/**
 * Test speed of JSON.stringify of objects
 */

var Benchmark = require('benchmark');
var range = require('lodash/range');
var zipObject = require('lodash/zipObject');

function ObjectFn () {
  this.field1 = Math.random();
  this.field2 = Math.random();
  this.field3 = Math.random();
}
ObjectFn.prototype.toJSON = function toJSON () {
  return {
    field1: this.field1,
    field2: this.field2,
    field3: this.field3,
  };
};

const numObjects = {
  100: zipObject(range(100), range(100).map(function () {
    return new ObjectFn();
  })),
  1000: zipObject(range(1000), range(1000).map(function () {
    return new ObjectFn();
  })),
  10000: zipObject(range(10000), range(10000).map(function () {
    return new ObjectFn();
  })),
  100000: zipObject(range(100000), range(100000).map(function () {
    return new ObjectFn();
  }))
};

(new Benchmark.Suite).add('stringify 100 objects', function () {
  JSON.stringify(numObjects[100]);
}).add('stringify 1000 objects', function () {
  JSON.stringify(numObjects[1000]);
}).add('stringify 10000 objects', function () {
  JSON.stringify(numObjects[10000]);
}).add('stringify 100000 objects', function () {
  JSON.stringify(numObjects[100000]);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
