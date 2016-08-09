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

## License
Copyright 2016, Joshua Gross, All Rights Reserved.

Released under MIT license.
