/**
 * Test speed of "get" into different data structures.
 */

var Benchmark = require('benchmark');
var Immutable = require('immutable');
var range = require('lodash/range');

var smallSuite = new Benchmark.Suite;
var smallAry = range(1000);
var smallList = Immutable.List.of(smallAry);

var mediumSuite = new Benchmark.Suite;
var mediumAry = range(10000);
var mediumList = Immutable.List.of(mediumAry);

var largeSuite = new Benchmark.Suite;
var largeAry = range(100000);
var largeList = Immutable.List.of(largeAry);

smallSuite.add('small: get from array directly', function () {
  range(1000).map(function (i) {
    return smallAry[i];
  });
}).add('small: get from immutable list', function () {
  range(1000).map(function (i) {
    return smallList.get(i);
  });
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

mediumSuite.add('medium: get from array directly', function () {
  range(10000).map(function (i) {
    return mediumAry[i];
  });
}).add('medium: get from immutable list', function () {
  range(10000).map(function (i) {
    return mediumList.get(i);
  });
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

largeSuite.add('large: get from array directly', function () {
  range(100000).map(function (i) {
    return largeAry[i];
  });
}).add('large: get from immutable list', function () {
  range(100000).map(function (i) {
    return largeList.get(i);
  });
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
