/**
 * Is manual destructuring any better / worse than ES6 sugary destructuring?
 */

var Benchmark = require('benchmark');

const myObject = {
  x: {
    y: {
      z: {
        foo: {
          bar: {
            baz: 1776
          }
        }
      }
    }
  }
};

(new Benchmark.Suite).add('destructure: ES6 sugar', function () {
  var { x: { y: { z: { foo: { bar: { baz: myBaz } } } } } } = myObject;
}).add('destructure: ES5 cumbersome', function () {
  var myBaz = (((((myObject.x || {}).y || {}).z || {}).foo || {}).bar || {}).baz || 0;
}).add('destructure: ES5 without defaults', function () {
  var myBaz = myObject.x.y.z.foo.bar.baz;
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });

(new Benchmark.Suite).add('destructure with failure: ES6 sugar / try/catch', function () {
  var myBaz;
  try {
    var { x: { y: { zed: { foo: { bar: { baz: myBaz } } } } } } = myObject;
  } catch (e) {
    myBaz = 0;
  }
}).add('destructure with failure: ES5 with defaults', function () {
  var myBaz = (((((myObject.x || {}).y || {}).zed || {}).foo || {}).bar || {}).baz || 0;
}).add('destructure with failure: ES5 try/catch', function () {
  var myBaz;
  try {
    myBaz = myObject.x.y.zed.foo.bar.baz;
  } catch (e) {
    myBaz = 0;
  }
}).on('cycle', function (event) {
  console.log(String(event.target));
}).on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({ async: false });
