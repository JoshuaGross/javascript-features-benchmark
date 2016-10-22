var Benchmark = require('benchmark');
var fork = require('child_process').fork;

(new Benchmark.Suite).add('fork', function (deferred) {
  var child = fork('child.js');
  child.on('message', function (msg) {
    deferred.resolve();
  });
}, { defer: true }).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
