# Javascript Features Benchmark

The goal of this repository is to answer miscellaneous questions about Javascript features by systematically benchmarking features against
each other. This is mostly for fun right now.

## Run tests
```shell
npm install
node inserts.js
```

## Results
### Inserts

Inserting into an array versus a dictionary always wins. Also tested: Immutable List, Immutable Map.

If you need immutable dictionaries, Immutable Maps are much better than copying dictionaries.

```
small: Insert into array directly x 752,603 ops/sec ±13.59% (46 runs sampled)
small: Insert into dictionary directly x 268,788 ops/sec ±7.47% (53 runs sampled)
small: Concatenate values to array x 14,329 ops/sec ±3.92% (65 runs sampled)
small: Object.assign({}) new values to object x 2,462 ops/sec ±12.64% (46 runs sampled)
small: Object.assign({}) new values to new object x 205 ops/sec ±22.28% (27 runs sampled)
small: assign to Immutable List x 8,673 ops/sec ±9.37% (58 runs sampled)
small: assign to Immutable Map x 8,017 ops/sec ±11.42% (51 runs sampled)
```

```
Fastest is small: Insert into array directly
medium: Insert into array directly x 9,832 ops/sec ±5.73% (71 runs sampled)
medium: Insert into dictionary directly x 5,174 ops/sec ±8.30% (62 runs sampled)
medium: Concatenate values to array x 9.93 ops/sec ±7.78% (25 runs sampled)
medium: Object.assign({}) new values to object x 26.97 ops/sec ±16.26% (35 runs sampled)
medium: Object.assign({}) new values to new object x 0.06 ops/sec ±14.83% (5 runs sampled)
medium: assign to Immutable List x 104 ops/sec ±13.69% (54 runs sampled)
medium: assign to Immutable Map x 63.14 ops/sec ±10.20% (48 runs sampled)
Fastest is medium: Insert into array directly
```

```
large: Insert into array directly x 2.51 ops/sec ±22.04% (12 runs sampled)
large: Insert into dictionary directly x 1.27 ops/sec ±30.23% (7 runs sampled)
...too slow to finish
```

### Lookup

Lookup in an array wins for small data-sizes. Lookup in medium-sized and large dictionaries wins, over arrays.

```
small: lookup in ary x 27,341,313 ops/sec ±15.02% (52 runs sampled)
small: lookup in dict x 23,856,026 ops/sec ±16.68% (52 runs sampled)
Fastest is small: lookup in ary
medium: lookup in ary x 25,933,037 ops/sec ±9.07% (52 runs sampled)
medium: lookup in dict x 26,733,449 ops/sec ±9.79% (53 runs sampled)
Fastest is medium: lookup in dict
large: lookup in ary x 6,385,043 ops/sec ±11.58% (47 runs sampled)
large: lookup in dict x 9,186,353 ops/sec ±3.75% (61 runs sampled)
Fastest is large: lookup in dict
```

### Coordinates

When doing many, many comparisons of latlong positions, finding the right balance between
correctness and speed is important.

I test 4 methods: haversine, equirectangular approximation, equirectangular without sqrt, a euclidian heuristic,
a euclidean heuristic projected to be closer to haversine, and a euclidean heuristic without sqrt.

The correctness of these methods varies dramatically based on the characteristics of input data: how close are the points,
how accurate do measurements need to be, how close are you to the poles, etc.

```
haversine x 1,279,756 ops/sec ±6.45% (59 runs sampled)
euclidian heuristic - no sqrt x 50,403,497 ops/sec ±7.30% (60 runs sampled)
euclidian heuristic x 31,181,339 ops/sec ±6.10% (64 runs sampled)
euclidian to radians heuristic x 31,714,894 ops/sec ±3.55% (68 runs sampled)
equirectangular approximation x 5,036,474 ops/sec ±5.34% (63 runs sampled)
equirectangular approximation squared x 6,833,702 ops/sec ±2.00% (71 runs sampled)
Fastest is euclidian heuristic - no sqrt
```

### Extracting numbers from a string
```
3 tokens: regex match x 2,483,887 ops/sec ±24.80% (36 runs sampled)
3 tokens: slice x 6,957,890 ops/sec ±6.10% (59 runs sampled)
Fastest is 3 tokens: slice
```

```
1 token: regex match x 3,322,778 ops/sec ±20.74% (42 runs sampled)
1 token: slice x 17,076,080 ops/sec ±7.14% (54 runs sampled)
Fastest is 1 token: slice
```

### Performance hit of running something asynchronously

Basically, I wanted to naively measure the performance hit you take when
running computations asynchronously. If you need to do something in an async
way, there's usually nothing around it. However, sometimes you'll have a synchronous
computation that blocks the main thread for too long and you'll need to split up the work.
This is the performance hit you'll take to complete your computations:

```
sync computation x 66,789,038 ops/sec ±7.69% (60 runs sampled)
setTimeout async computation x 1,309,191 ops/sec ±6.14% (66 runs sampled)
nextTick async computation x 1,922,815 ops/sec ±6.49% (52 runs sampled)
Fastest is sync computation
```

It should be noted that in these tests there's a 1:1 ratio of "computations"
and "CPU yields". In the 1:1 case, purely synchronous functions will execute
60-70x faster than the asynchronous functions. If you do more computations before
yielding, you will see better performance.

### Destructuring

What is the fastest way to destructure an object? ES6 or more traditional object getters?

Unintuitively, ES6 destructuring is fairly slow (Node v6.3.1/V8 5.0.71.57) even compared to the
very cumbersome ES5 approach:

```
destructure: ES6 sugar x 16,514,713 ops/sec ±9.28% (65 runs sampled)
destructure: ES5 cumbersome x 29,495,011 ops/sec ±6.79% (68 runs sampled)
destructure: ES5 without defaults x 54,165,189 ops/sec ±4.84% (65 runs sampled)
Fastest is destructure: ES5 without defaults
```

```
destructure with failure: ES6 sugar / try/catch x 127,010 ops/sec ±6.84% (59 runs sampled)
destructure with failure: ES5 with defaults x 19,172,485 ops/sec ±5.84% (70 runs sampled)
destructure with failure: ES5 try/catch x 127,874 ops/sec ±6.63% (60 runs sampled)
Fastest is destructure with failure: ES5 with defaults
```

## License
Copyright 2016, Joshua Gross, All Rights Reserved.

Released under MIT license.
