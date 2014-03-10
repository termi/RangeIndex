
const utils = require('../utils')
	, RangeIndex = utils.getES5Module('RangeIndex')
	, rangeIndex = new RangeIndex()
	, dataset = [
		{from: 0, to: 10, data: '0-10'}, {from: 0, to: 20, data: '0-20'}, {from: 0, to: 50, data: '0-50'}
		, {from: 50, to: 100, data: '50-100'}, {from: 50, to: 120, data: '50-120'}, {from: 50, to: 150, data: '50-150'}
		, {from: 150, to: 1000, data: '150-1000'}
		, {from: 250, to: 1200, data: '250-1200'}
		, {from: 350, to: 2000, data: '350-2000'}
	]
;

function sortDataset({from1, to1}, {from2, to2}) {
	var res = from1 < from2;
	if( !res ) {
		if( to1 == to2 ) {
			return 0;
		}
		res = to1 < to2;
	}
	return res ? -1 : 1;
}

for( let {from, to, data} of dataset.sort(sortDataset) ) {
	rangeIndex.put(from, to, data);
}

let testDescription_find = exports['find'] = {};

for( let [testFrom, testTo] of [[0, 100], [0, 150], [50, 150], [50, 1200], [150, 1200], [150, 2000], [350, 2000]] ) {
	testDescription_find[`find ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = dataset.filter( ({from, to}) => from >= testFrom && to <= testTo ).map( ({data}) => data);
		const countExpected = resultExpected.length;

		const result = rangeIndex.find(testFrom, testTo);

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}

for( let [testFrom, testTo] of [[10, 155], [150, 250], [150, 1100], [150, 1200], [151, 1999], [500, 501]] ) {
	testDescription_find[`findOuter ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = dataset.filter( ({from, to}) => from <= testFrom && to >= testTo ).map( ({data}) => data);
		const countExpected = resultExpected.length;

		let result = rangeIndex.findOuter(testFrom, testTo);

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}

for( let [testFrom, testTo] of [[10, 20], [10, 155], [50, 100], [70, 80]] ) {
	testDescription_find[`findOuter with sort ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = dataset.filter( ({from, to}) => from <= testFrom && to >= testTo ).map( ({data}) => data);
		const countExpected = resultExpected.length;

		let result = rangeIndex.findOuter(testFrom, testTo, {sort: sortDataset});

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}
