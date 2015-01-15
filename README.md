# fast-filter

A fully compatible replacement for the native `[].filter` method that performs [10 times faster](http://jsperf.com/fastfilter-vs-native-array-filter) in most environments.

## Install

```bash
npm install fast-filter
```

## Basic usage
```js
var fastFilter = require('fast-filter');

fastFilter([1,2,3,4,5,6], function(val) { return val % 2; }); // [1,3,5]
```

## "Installing" on the Array.prototype
You can add `fastFilter` to the native `Array.prototype` for convienience.
```js
require('fast-filter').install();

[1,2,3,4,5,6].fastFilter(function(val) { return val % 2; }); // [1,3,5]
```

Or provide an alias:
```js
require('fast-filter').install('select');

[1,2,3,4,5,6].select(function(val) { return val % 2; }); // [1,3,5]
```

## Replacing the native `filter` method
You can replace the native `Array.prototype.filter` method, but keep in mind that this will modify the `filter` method for all code in this instance including any required modules and may result in unexpected behavior.
```js
require('fast-filter').install('filter');

[1,2,3,4,5,6].filter(function(val) { return val % 2; }); // [1,3,5]
```
