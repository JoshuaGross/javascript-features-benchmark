/**
 * I wanted to see how much faster/slower haversine and cartesian distance calculations are, vs the other.
 */

var Benchmark = require('benchmark');
var fastHaversine = require('fast-haversine');
var geohash = require('latlon-geohash');
var uniq = require('lodash/uniq');
var zipObject = require('lodash/zipObject');

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

/**
 * "heat maps" as objects.
 * Keep track of the number of points at different levels.
 */
function createHeatMap () {
  return {
    count: 0,
    1: {}, // 11.1km
    2: {}, // 1.1km
    3: {}, // 110m
    4: {}, // 11m
    5: {}, // 1.1m
    6: {}, // 0.11m
  };
}
function addPointToHeatMap (map, lat, lon, bleed) {
  bleed = bleed || 1;

  //map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 6);
  map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 5);
  map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 4);
  map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 3);
  map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 2);
  map = addPointToHeatMapWithPrecision(map, lat, lon, bleed, 1);

  map.count++;

  return map;
}
function addPointToHeatMapWithPrecision (map, lat, lon, bleed, precision) {
  const fudge = Math.pow(0.1, precision);

  const keys = [
    [lat, lon, 1],
    [lat + fudge, lon, 0.5],
    [lat - fudge, lon, 0.5],
    [lat, lon + fudge, 0.5],
    [lat, lon - fudge, 0.5],
    [lat + fudge, lon - fudge, 0.25],
    [lat - fudge, lon - fudge, 0.25],
    [lat + fudge, lon + fudge, 0.25],
    [lat - fudge, lon + fudge, 0.25],
    [lat + fudge, lon - fudge, 0.25],
    [lat - fudge, lon - fudge, 0.25]
  ].map(function (p) {
    return [p[0].toFixed(precision), p[1].toFixed(precision), p[2]];
  });

  keys.forEach(function (keyAry) {
    const lat = keyAry[0];
    const lon = keyAry[1];
    const weight = keyAry[2];
    const key = lat + ',' + lon;

    map[precision][key] = (map[precision][key] || 0) + weight;
  });

  return map;
}

/**
 * Add a geohash (12 precision) to a heatmap.
 */
function addGeohashToHeatmap (map, hash) {
  map.count++;

  const now = Date.now();

  let hashWeightObj = {};
  hashWeightObj[hash] = 1;

  // Add gradient of neighbors to hash weight object
  const neighbors = geohash.neighbours(hash);
  const neighborKeys = Object.keys(neighbors);
  let weights = Object.assign(zipObject(neighborKeys.map(function (k) {
    return neighbors[k];
  }), neighborKeys.map(function (k) {
    return 0.5 / k.length;
  })), hashWeightObj);

  while (Object.keys(weights).length > 0) {
    Object.keys(weights).forEach(function (k) {
      const mapIdx = map[k] || {};
      Object.assign(mapIdx, {
        weight: (mapIdx.weight || 0) + weights[k],
        updated: now
      });
    });

    const oldWeights = weights;
    weights = Object.keys(weights).reduce(function (prev, key) {
      const newKey = key.slice(0, -1);

      if (newKey === '' || prev[newKey]) {
        return prev;
      }

      prev[newKey] = oldWeights[key];
      return prev;
    }, {});
  }

  return map;
}

const denseHeatmap = { count: 0 };
for (let i = 0; i < 10000; i++) {
  addGeohashToHeatmap(denseHeatmap,
                      geohash.encode(pos1.lat + Math.random() * 0.000006,
                                     pos1.lon + Math.random() * 0.000006, 12));
}

(new Benchmark.Suite()).add('haversine', function () {
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

(new Benchmark.Suite()).add('geohash', function () {
  geohash.encode(pos1.lat, pos1.lon, 12);
  geohash.encode(pos2.lat, pos2.lon, 12);
  geohash.encode(pos3.lat, pos3.lon, 12);
  geohash.encode(pos4.lat, pos4.lon, 12);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite()).add('geohash heatmap', function () {
  const heatmap = { count: 0 };
  addGeohashToHeatmap(heatmap, geohash.encode(pos1.lat, pos1.lon, 12));
  addGeohashToHeatmap(heatmap, geohash.encode(pos2.lat, pos2.lon, 12));
  addGeohashToHeatmap(heatmap, geohash.encode(pos3.lat, pos3.lon, 12));
  addGeohashToHeatmap(heatmap, geohash.encode(pos4.lat, pos4.lon, 12));
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite()).add('geohash heatmap - add to dense heatmap', function () {
  addGeohashToHeatmap(denseHeatmap, geohash.encode(pos1.lat, pos1.lon, 12));
  addGeohashToHeatmap(denseHeatmap, geohash.encode(pos2.lat, pos2.lon, 12));
  addGeohashToHeatmap(denseHeatmap, geohash.encode(pos3.lat, pos3.lon, 12));
  addGeohashToHeatmap(denseHeatmap, geohash.encode(pos4.lat, pos4.lon, 12));
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite()).add('heatmap', function () {
  const heatmap = createHeatMap();
  addPointToHeatMap(heatmap, pos1.lat, pos1.lon);
  addPointToHeatMap(heatmap, pos2.lat, pos2.lon);
  addPointToHeatMap(heatmap, pos3.lat, pos3.lon);
  addPointToHeatMap(heatmap, pos4.lat, pos4.lon);
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
