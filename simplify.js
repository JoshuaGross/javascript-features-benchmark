// At what framerate can you run simplify.js? On how many points?
var Benchmark = require('benchmark');
var range = require('lodash/range');
var simplify = require('simplify-js');

// The test: with generated data, run simplify.js on a set of data at increasing zoom levels.
const beginX = 37.77312000;
const endX =   37.65000000;
const beginY = -122.4146685;
const endY =   -122.4750000;

function generatePath (count) {
  return range(count).map(function (i) {
    return {
      x: beginX + (endX - beginX) * (i / count) + Math.random() * 0.0001,
      y: beginY + (endY - beginY) * (i / count) + Math.random() * 0.0001
    };
  });
}

// This represents a path of points generated at 10hz, running for 20 minutes, 60 minutes, 120 minutes, 240 minutes, 480 minutes
const points20m = generatePath(10*60*20);
const points60m = generatePath(10*60*60);
const points120m = generatePath(10*60*120);
const points240m = generatePath(10*60*240);
const points480m = generatePath(10*60*480);

// In naive distance between latlongs, these are the translations of distance from meters
const _05meter = 5.054870942951528e-12;
const _1meter = 8.087793508722445e-11;
const _5meters = 5.054870942951528e-8;
const _25meters = 0.00003159294339344705;
const _100meters = 0.008087793508722445;
const _500meters = 5.054870942951529;
const _1000meters = 80.87793508722446;

// See how much this reduces size...
function testSizeReduction (ary, tolerance) {
  console.log('Simplify reduces ' + ary.length + ' points, at ' + tolerance + ' tolerance, by ' + ((ary.length - simplify(ary, tolerance).length) / ary.length * 100) + '%');
}

testSizeReduction(points20m, _05meter);
testSizeReduction(points20m, _1meter);
testSizeReduction(points20m, _5meters);
testSizeReduction(points20m, _25meters);
testSizeReduction(points20m, _100meters);
testSizeReduction(points20m, _500meters);
testSizeReduction(points20m, _1000meters);

testSizeReduction(points60m, _05meter);
testSizeReduction(points60m, _1meter);
testSizeReduction(points60m, _5meters);
testSizeReduction(points60m, _25meters);
testSizeReduction(points60m, _100meters);
testSizeReduction(points60m, _500meters);
testSizeReduction(points60m, _1000meters);

testSizeReduction(points120m, _05meter);
testSizeReduction(points120m, _1meter);
testSizeReduction(points120m, _5meters);
testSizeReduction(points120m, _25meters);
testSizeReduction(points120m, _100meters);
testSizeReduction(points120m, _500meters);
testSizeReduction(points120m, _1000meters);

testSizeReduction(points240m, _05meter);
testSizeReduction(points240m, _1meter);
testSizeReduction(points240m, _5meters);
testSizeReduction(points240m, _25meters);
testSizeReduction(points240m, _100meters);
testSizeReduction(points240m, _500meters);
testSizeReduction(points240m, _1000meters);

testSizeReduction(points480m, _05meter);
testSizeReduction(points480m, _1meter);
testSizeReduction(points480m, _5meters);
testSizeReduction(points480m, _25meters);
testSizeReduction(points480m, _100meters);
testSizeReduction(points480m, _500meters);
testSizeReduction(points480m, _1000meters);

(new Benchmark.Suite).add('simplify: 20 minutes of points, 0.5 meters of tolerance', function () {
  simplify(points20m, _05meter);
}).add('simplify: 20 minutes of points, 1 meter of tolerance', function () {
  simplify(points20m, _1meter);
}).add('simplify: 20 minutes of points, 5 meters of tolerance', function () {
  simplify(points20m, _5meters);
}).add('simplify: 20 minutes of points, 25 meters of tolerance', function () {
  simplify(points20m, _25meters);
}).add('simplify: 20 minutes of points, 100 meters of tolerance', function () {
  simplify(points20m, _100meters);
}).add('simplify: 20 minutes of points, 500 meters of tolerance', function () {
  simplify(points20m, _500meters);
}).add('simplify: 20 minutes of points, 1000 meters of tolerance', function () {
  simplify(points20m, _1000meters);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('simplify: 60 minutes of points, 0.5 meters of tolerance', function () {
  simplify(points60m, _05meter);
}).add('simplify: 60 minutes of points, 1 meter of tolerance', function () {
  simplify(points60m, _1meter);
}).add('simplify: 60 minutes of points, 5 meters of tolerance', function () {
  simplify(points60m, _5meters);
}).add('simplify: 60 minutes of points, 25 meters of tolerance', function () {
  simplify(points60m, _25meters);
}).add('simplify: 60 minutes of points, 100 meters of tolerance', function () {
  simplify(points60m, _100meters);
}).add('simplify: 60 minutes of points, 500 meters of tolerance', function () {
  simplify(points60m, _500meters);
}).add('simplify: 60 minutes of points, 1000 meters of tolerance', function () {
  simplify(points60m, _1000meters);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('simplify: 120 minutes of points, 0.5 meters of tolerance', function () {
  simplify(points120m, _05meter);
}).add('simplify: 120 minutes of points, 1 meter of tolerance', function () {
  simplify(points120m, _1meter);
}).add('simplify: 120 minutes of points, 5 meters of tolerance', function () {
  simplify(points120m, _5meters);
}).add('simplify: 120 minutes of points, 25 meters of tolerance', function () {
  simplify(points120m, _25meters);
}).add('simplify: 120 minutes of points, 100 meters of tolerance', function () {
  simplify(points120m, _100meters);
}).add('simplify: 120 minutes of points, 500 meters of tolerance', function () {
  simplify(points120m, _500meters);
}).add('simplify: 120 minutes of points, 1000 meters of tolerance', function () {
  simplify(points120m, _1000meters);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('simplify: 240 minutes of points, 0.5 meters of tolerance', function () {
  simplify(points240m, _05meter);
}).add('simplify: 240 minutes of points, 1 meter of tolerance', function () {
  simplify(points240m, _1meter);
}).add('simplify: 240 minutes of points, 5 meters of tolerance', function () {
  simplify(points240m, _5meters);
}).add('simplify: 240 minutes of points, 25 meters of tolerance', function () {
  simplify(points240m, _25meters);
}).add('simplify: 240 minutes of points, 100 meters of tolerance', function () {
  simplify(points240m, _100meters);
}).add('simplify: 240 minutes of points, 500 meters of tolerance', function () {
  simplify(points240m, _500meters);
}).add('simplify: 240 minutes of points, 1000 meters of tolerance', function () {
  simplify(points240m, _1000meters);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('simplify: 480 minutes of points, 0.5 meters of tolerance', function () {
  simplify(points480m, _05meter);
}).add('simplify: 480 minutes of points, 1 meter of tolerance', function () {
  simplify(points480m, _1meter);
}).add('simplify: 480 minutes of points, 5 meters of tolerance', function () {
  simplify(points480m, _5meters);
}).add('simplify: 480 minutes of points, 25 meters of tolerance', function () {
  simplify(points480m, _25meters);
}).add('simplify: 480 minutes of points, 100 meters of tolerance', function () {
  simplify(points480m, _100meters);
}).add('simplify: 480 minutes of points, 500 meters of tolerance', function () {
  simplify(points480m, _500meters);
}).add('simplify: 480 minutes of points, 1000 meters of tolerance', function () {
  simplify(points480m, _1000meters);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
