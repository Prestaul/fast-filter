function fastFilter(array, fn, thisArg) {
	var result = [],
		test = (thisArg === undefined ? fn : function(a,b,c) { return fn.call(thisArg,a,b,c); }),
		i, len;
	for(i = 0, len = array.length; i < len; i++) {
		if(test(array[i], i, array)) result.push(array[i]);
	}
	return result;
}

fastFilter.install = function(name) {
	Array.prototype[name || 'fastFilter'] = function(fn, thisArg) {
		return fastFilter(this, fn, thisArg);
	};

	return fastFilter;
};

module.exports = fastFilter;
