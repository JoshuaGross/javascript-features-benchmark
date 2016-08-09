/**
 * Test speed of "insert" into different data structures.
 */

var Benchmark = require('benchmark');
var Immutable = require('immutable');

var smallSuite = new Benchmark.Suite;
var smallSize = 100;

var mediumSuite = new Benchmark.Suite;
var mediumSize = 10000;

var largeSuite = new Benchmark.Suite;
var largeSize = 10000000;

smallSuite.add('small: Insert into array directly', function () {
  var ary = [];
  for (var i = 0; i < smallSize; i++) {
    ary.push(i);
  }
}).add('small: Insert into dictionary directly', function () {
  var dict = {};
  for (var i = 0; i < smallSize; i++) {
    dict[i] = i;
  }
}).add('small: Concatenate values to array', function () {
  var ary = [];
  for (var i = 0; i < smallSize; i++) {
    ary = ary.concat([i]);
  }
}).add('small: Object.assign({}) new values to object', function () {
  var dict = {};
  for (var i = 0; i < smallSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign(dict, newDict);
  }
}).add('small: Object.assign({}) new values to new object', function () {
  var dict = {};
  for (var i = 0; i < smallSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign({}, dict, newDict);
  }
}).add('small: assign to Immutable List', function () {
  var lst = Immutable.List();
  for (var i = 0; i < smallSize; i++) {
    lst = lst.push(i);
  }
}).add('small: assign to Immutable Map', function () {
  var imap = Immutable.Map();
  for (var i = 0; i < smallSize; i++) {
    imap = imap.set(i, i);
  }
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

mediumSuite.add('medium: Insert into array directly', function () {
  var ary = [];
  for (var i = 0; i < mediumSize; i++) {
    ary.push(i);
  }
}).add('medium: Insert into dictionary directly', function () {
  var dict = {};
  for (var i = 0; i < mediumSize; i++) {
    dict[i] = i;
  }
}).add('medium: Concatenate values to array', function () {
  var ary = [];
  for (var i = 0; i < mediumSize; i++) {
    ary = ary.concat([i]);
  }
}).add('medium: Object.assign({}) new values to object', function () {
  var dict = {};
  for (var i = 0; i < mediumSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign(dict, newDict);
  }
}).add('medium: Object.assign({}) new values to new object', function () {
  var dict = {};
  for (var i = 0; i < mediumSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign({}, dict, newDict);
  }
}).add('medium: assign to Immutable List', function () {
  var lst = Immutable.List();
  for (var i = 0; i < mediumSize; i++) {
    lst = lst.push(i);
  }
}).add('medium: assign to Immutable Map', function () {
  var imap = Immutable.Map();
  for (var i = 0; i < mediumSize; i++) {
    imap = imap.set(i, i);
  }
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

largeSuite.add('large: Insert into array directly', function () {
  var ary = [];
  for (var i = 0; i < largeSize; i++) {
    ary.push(i);
  }
}).add('large: Insert into dictionary directly', function () {
  var dict = {};
  for (var i = 0; i < largeSize; i++) {
    dict[i] = i;
  }
}).add('large: Concatenate values to array', function () {
  var ary = [];
  for (var i = 0; i < largeSize; i++) {
    ary = ary.concat([i]);
  }
}).add('large: Object.assign({}) new values to object', function () {
  var dict = {};
  for (var i = 0; i < largeSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign(dict, newDict);
  }
}).add('large: Object.assign({}) new values to new object', function () {
  var dict = {};
  for (var i = 0; i < largeSize; i++) {
    var newDict = {};
    newDict[i] = i;
    dict = Object.assign({}, dict, newDict);
  }
}).add('large: assign to Immutable List', function () {
  var lst = Immutable.List();
  for (var i = 0; i < largeSize; i++) {
    lst = lst.push(i);
  }
}).add('large: assign to Immutable Map', function () {
  var imap = Immutable.Map();
  for (var i = 0; i < largeSize; i++) {
    imap = imap.set(i, i);
  }
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
