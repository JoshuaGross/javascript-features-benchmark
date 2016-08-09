/**
 * I wanted to see how much faster/slower haversine and cartesian distance calculations are, vs the other.
 */

var Benchmark = require('benchmark');
var fastHaversine = require('fast-haversine');
var suite = new Benchmark.Suite;

var pos1 = { lat: -34.607814, lon: -58.370301 };
var pos2 = { lat: -34.607800, lon: -58.370300 };
var pos3 = { lat: -34.5161001, lon: -58.4847728 };
var pos4 = { lat: 1, lon: 1 };

var PI_180 = Math.PI / 180;
var earthRadius = 6371e3; // metres

/**
 * This function is wrong! I've just been curious how much
 * faster/slower haversine is than doing cartesian distances.
 */
function llaDistEuclideanHeuristicSquare (coord1, coord2) {
  var x = coord1.lat - coord2.lat;
  var y = coord1.lon - coord2.lon;
  return Math.pow(x, 2) + Math.pow(y, 2);
}

/**
 * This function is wrong! I've just been curious how much
 * faster/slower haversine is than doing cartesian distances.
 */
function llaDistEuclideanHeuristic (coord1, coord2) {
  var x = coord1.lat - coord2.lat;
  var y = coord1.lon - coord2.lon;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/**
 * This function is... less wrong! I've just been curious how much
 * faster/slower haversine is than doing cartesian distances.
 * This function is, however, remarkably close when you multiply
 * the result by `PI_180*earthRadius` - it is off by meters.
 */
function llaDistEuclideanToRadians (coord1, coord2) {
  var x = coord1.lat - coord2.lat;
  var y = coord1.lon - coord2.lon;
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))*PI_180*earthRadius;
}

function toRad (num) {
  return num * PI_180;
}

function llaDistEquirectangularApprox (coord1, coord2) {
  var lat1 = toRad(coord1.lat);
  var lat2 = toRad(coord2.lat);
  var lon1 = toRad(coord1.lon);
  var lon2 = toRad(coord2.lon);

  var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
  var y = (lat2-lat1);
  return Math.sqrt(x*x + y*y) * earthRadius;
}


function llaDistEquirectangularApproxSquared (coord1, coord2) {
  var lat1 = toRad(coord1.lat);
  var lat2 = toRad(coord2.lat);
  var lon1 = toRad(coord1.lon);
  var lon2 = toRad(coord2.lon);

  var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
  var y = (lat2-lat1);
  return x*x + y*y;
}

suite.add('haversine', function () {
  fastHaversine(pos1, pos2);
  fastHaversine(pos1, pos3);
  fastHaversine(pos1, pos4);
  fastHaversine(pos2, pos3);
  fastHaversine(pos2, pos4);
  fastHaversine(pos3, pos4);
}).add('euclidian heuristic - no sqrt', function () {
  llaDistEuclideanHeuristicSquare(pos1, pos2);
  llaDistEuclideanHeuristicSquare(pos1, pos3);
  llaDistEuclideanHeuristicSquare(pos1, pos4);
  llaDistEuclideanHeuristicSquare(pos2, pos3);
  llaDistEuclideanHeuristicSquare(pos2, pos4);
  llaDistEuclideanHeuristicSquare(pos3, pos4);
}).add('euclidian heuristic', function () {
  llaDistEuclideanHeuristic(pos1, pos2);
  llaDistEuclideanHeuristic(pos1, pos3);
  llaDistEuclideanHeuristic(pos1, pos4);
  llaDistEuclideanHeuristic(pos2, pos3);
  llaDistEuclideanHeuristic(pos2, pos4);
  llaDistEuclideanHeuristic(pos3, pos4);
}).add('euclidian to radians heuristic', function () {
  llaDistEuclideanToRadians(pos1, pos2);
  llaDistEuclideanToRadians(pos1, pos3);
  llaDistEuclideanToRadians(pos1, pos4);
  llaDistEuclideanToRadians(pos2, pos3);
  llaDistEuclideanToRadians(pos2, pos4);
  llaDistEuclideanToRadians(pos3, pos4);
}).add('equirectangular approximation', function () {
  llaDistEquirectangularApprox(pos1, pos2);
  llaDistEquirectangularApprox(pos1, pos3);
  llaDistEquirectangularApprox(pos1, pos4);
  llaDistEquirectangularApprox(pos2, pos3);
  llaDistEquirectangularApprox(pos2, pos4);
  llaDistEquirectangularApprox(pos3, pos4);
}).add('equirectangular approximation squared', function () {
  llaDistEquirectangularApproxSquared(pos1, pos2);
  llaDistEquirectangularApproxSquared(pos1, pos3);
  llaDistEquirectangularApproxSquared(pos1, pos4);
  llaDistEquirectangularApproxSquared(pos2, pos3);
  llaDistEquirectangularApproxSquared(pos2, pos4);
  llaDistEquirectangularApproxSquared(pos3, pos4);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
