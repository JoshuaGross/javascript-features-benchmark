/**
 * Test speed of "lookup" in different data structures.
 */

var Benchmark = require('benchmark');

var smallSuite = new Benchmark.Suite;
var smallSize = 100;

var mediumSuite = new Benchmark.Suite;
var mediumSize = 10000;

var largeSuite = new Benchmark.Suite;
var largeSize = 10000000;

var smallAry = [], smallDict = {};
for (var i = 0; i < smallSize; i++) {
  smallAry.push(i);
  smallDict[i] = i;
}

var mediumAry = [], mediumDict = {};
for (var i = 0; i < mediumSize; i++) {
  mediumAry.push(i);
  mediumDict[i] = i;
}

var largeAry = [], largeDict = {};
for (var i = 0; i < largeSize; i++) {
  largeAry.push(i);
  largeDict[i] = i;
}

smallSuite.add('small: lookup in ary', function () {
  var index = Math.floor(Math.random() * smallSize);
  return smallAry[index];
}).add('small: lookup in dict', function () {
  var index = Math.floor(Math.random() * smallSize);
  return smallDict[index];
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

mediumSuite.add('medium: lookup in ary', function () {
  var index = Math.floor(Math.random() * mediumSize);
  return mediumAry[index];
}).add('medium: lookup in dict', function () {
  var index = Math.floor(Math.random() * mediumSize);
  return mediumDict[index];
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

largeSuite.add('large: lookup in ary', function () {
  var index = Math.floor(Math.random() * largeSize);
  return largeAry[index];
}).add('large: lookup in dict', function () {
  var index = Math.floor(Math.random() * largeSize);
  return largeDict[index];
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
