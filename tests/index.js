var has = Object.prototype.hasOwnProperty;
var getKeys = function (o) {
    var key, a = [];
    for (key in o) {
        if (has.call(o, key)) {
            a.push(key);
        }
    }
    return a;
};

beforeEach(function () {
    'use strict';
    this.addMatchers({
        toExactlyMatch: function (expected) {
            var a1, a2, l, i, key;
            var actual = this.actual;

            a1 = getKeys(actual);
            a2 = getKeys(expected);

            l = a1.length;
            if (l !== a2.length) {
                return false;
            }
            for (i = 0; i < l; i++) {
                key = a1[i];
                expect(key).toEqual(a2[i]);
                expect(actual[key]).toEqual(expected[key]);
            }

            return true;
        }
    });
});


var toStr = Object.prototype.toString;


function createArrayLikeFromArray(arr) {
	var o = {};
	Array.prototype.forEach.call(arr, function (e, i) {
		o[i] = e;
	});
	o.length = arr.length;
	return o;
}


describe('filter', function () {
	var filteredArray,
		callback = function callback(o, i) {
			return i !== 3 && i !== 5;
		};

	beforeEach(function () {
		testSubject = [2, 3, undefined, true, 'hej', 3, null, false, 0];
		delete testSubject[1];
		filteredArray = [2, undefined, 'hej', null, false, 0];
	});

	describe('Array object', function () {
		it('should call the callback with the proper arguments', function () {
			var predicate = jasmine.createSpy('predicate');
			var arr = ['1'];
			arr.filter(predicate);
			expect(predicate).toHaveBeenCalledWith('1', 0, arr);
		});

		it('should not affect elements added to the array after it has begun', function () {
			var arr = [1, 2, 3];
			var i = 0;
			arr.filter(function (a) {
				i++;
				if (i <= 4) {
					arr.push(a + 3);
				}
				return true;
			});
			expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
			expect(i).toBe(3);
		});

		it('should skip non-set values', function () {
			var passedValues = {};
			testSubject = [1, 2, 3, 4];
			delete testSubject[1];
			testSubject.filter(function (o, i) {
				passedValues[i] = o;
				return true;
			});
			expect(passedValues).toExactlyMatch(testSubject);
		});

		it('should pass the right context to the filter', function () {
			var passedValues = {};
			testSubject = [1, 2, 3, 4];
			delete testSubject[1];
			testSubject.filter(function (o, i) {
				this[i] = o;
				return true;
			}, passedValues);
			expect(passedValues).toExactlyMatch(testSubject);
		});

		it('should set the right context when given none', function () {
			var context;
			[1].filter(function () {context = this;});
			expect(context).toBe(function () { return this; }.call());
		});

		it('should remove only the values for which the callback returns false', function () {
			var result = testSubject.filter(callback);
			expect(result).toExactlyMatch(filteredArray);
		});

		it('should leave the original array untouched', function () {
			var copy = testSubject.slice();
			testSubject.filter(callback);
			expect(testSubject).toExactlyMatch(copy);
		});

		it('should not be affected by same-index mutation', function () {
			var results = [1, 2, 3].filter(function (value, index, array) {
				array[index] = 'a';
				return true;
			});
			expect(results).toEqual([1, 2, 3]);
		});
	});

	describe('Array like', function () {
		beforeEach(function () {
			testSubject = createArrayLikeFromArray(testSubject);
		});

		it('should call the predicate with the proper arguments', function () {
			var predicate = jasmine.createSpy('predicate');
			var arr = createArrayLikeFromArray(['1']);
			Array.prototype.filter.call(arr, predicate);
			expect(predicate).toHaveBeenCalledWith('1', 0, arr);
		});

		it('should not affect elements added to the array after it has begun', function () {
			var arr = createArrayLikeFromArray([1, 2, 3]),
				i = 0;
			Array.prototype.filter.call(arr, function (a) {
				i++;
				if (i <= 4) {
					arr[i + 2] = a + 3;
				}
				return true;
			});
			delete arr.length;
			expect(arr).toExactlyMatch([1, 2, 3, 4, 5, 6]);
			expect(i).toBe(3);
		});

		it('should skip non-set values', function () {
			var passedValues = {};
			testSubject = createArrayLikeFromArray([1, 2, 3, 4]);
			delete testSubject[1];
			Array.prototype.filter.call(testSubject, function (o, i) {
				passedValues[i] = o;
				return true;
			});
			delete testSubject.length;
			expect(passedValues).toExactlyMatch(testSubject);
		});

		it('should set the right context when given none', function () {
			var context;
			Array.prototype.filter.call(createArrayLikeFromArray([1]), function () {context = this;}, undefined);
			expect(context).toBe(function () { return this; }.call());
		});

		it('should pass the right context to the filter', function () {
			var passedValues = {};
			testSubject = createArrayLikeFromArray([1, 2, 3, 4]);
			delete testSubject[1];
			Array.prototype.filter.call(testSubject, function (o, i) {
				this[i] = o;
				return true;
			}, passedValues);
			delete testSubject.length;
			expect(passedValues).toExactlyMatch(testSubject);
		});

		it('should remove only the values for which the callback returns false', function () {
			var result = Array.prototype.filter.call(testSubject, callback);
			expect(result).toExactlyMatch(filteredArray);
		});

		it('should leave the original array untouched', function () {
			var copy = createArrayLikeFromArray(testSubject);
			Array.prototype.filter.call(testSubject, callback);
			expect(testSubject).toExactlyMatch(copy);
		});
	});

	it('should have a boxed object as list argument of callback', function () {
		var actual;
		Array.prototype.filter.call('foo', function (item, index, list) {
			actual = list;
		});
		expect(typeof actual).toBe('object');
		expect(toStr.call(actual)).toBe('[object String]');
	});
});
