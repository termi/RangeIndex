
const utils = require('../utils')
	, RangeIndex = utils.getES5Module('RangeIndex')
	, rangeIndex = new RangeIndex()
;


function sortDataset({from: from1, to: to1}, {from: from2, to: to2}) {
	var res = from1 - from2;
	if( !res ) {
		if( to1 == to2 ) {
			return 0;
		}
		res = to1 - to2;
	}
	return res;
}

function reverseSortDataset({from: from1, to: to1}, {from: from2, to: to2}) {
	var res = from2 - from1;
	if( !res ) {
		if( to1 == to2 ) {
			return 0;
		}
		res = to2 - to1;
	}
	return res;
}

let dataset = loadDataset();
let reverseDataset = dataset.slice().sort(reverseSortDataset);

for( let {from, to, data} of dataset ) {
	rangeIndex.put(from, to, data);
}

dataset = dataset.sort(sortDataset);

let testDescription_find = exports['find'] = {};

for( let [testFrom, testTo] of [[0, 100], [0, 150], [50, 150], [50, 1200], [150, 1200], [150, 2000], [350, 2000], [0, 2576]] ) {
	testDescription_find[`find ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = dataset
			.filter( ({from, to}) => from >= testFrom && to <= testTo )
			.sort(sortDataset)
			.map( ({data}) => data )
		;
		const countExpected = resultExpected.length;

		const result = rangeIndex.find(testFrom, testTo);

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}

for( let [testFrom, testTo] of [[10, 20], [10, 155], [50, 100], [70, 80], [0, 2576]] ) {
	testDescription_find[`find with sort ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = reverseDataset
			.filter( ({from, to}) => from >= testFrom && to <= testTo )
			.map( ({data}) => data )
		;
		const countExpected = resultExpected.length;

		let result = rangeIndex.find(testFrom, testTo, {sort: reverseSortDataset});

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}

for( let [testFrom, testTo] of [[10, 155], [150, 250], [150, 1100], [150, 1200], [151, 1999], [500, 501], [0, 2576]] ) {
	testDescription_find[`findOuter ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = dataset
			.filter( ({from, to}) => from <= testFrom && to >= testTo )
			.sort(sortDataset)
			.map( ({data}) => data )
		;
		const countExpected = resultExpected.length;

		let result = rangeIndex.findOuter(testFrom, testTo);

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}

for( let [testFrom, testTo] of [[10, 20], [10, 155], [50, 100], [70, 80], [0, 2576]] ) {
	testDescription_find[`findOuter with sort ${testFrom}-${testTo}`] = (test) => {
		const resultExpected = reverseDataset
			.filter( ({from, to}) => from <= testFrom && to >= testTo )
			.map( ({data}) => data )
		;
		const countExpected = resultExpected.length;

		let result = rangeIndex.findOuter(testFrom, testTo, {sort: reverseSortDataset});

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}


for( let testFrom of [0, 10, 50, 70, 150, 500, 2576] ) {
	testDescription_find[`startsFrom ${testFrom}`] = (test) => {
		const resultExpected = dataset
			.filter( ({from}) => from === testFrom )
			.sort(sortDataset)
			.map( ({data}) => data )
		;
		const countExpected = resultExpected.length;

		let result = rangeIndex.startsFrom(testFrom);

		test.equals(result.length, countExpected, `should found ${countExpected} objects, but ${result.length} found`);
		test.deepEqual(result, resultExpected);
		test.done();
	}
}


function loadDataset() {
	return [
		[0, 10], [0, 20], [0, 50], [50, 100], [50, 120], [50, 150], [150, 1000], [250, 1200], [350, 2000], [ 0, 1843 ],
		[ 1847, 1885 ],	[ 1887, 2572 ], [ 2630, 2700 ], [ 2706, 2742 ], [ 4130, 4191 ], [ 4352, 4375 ], [ 4519, 4544 ],
		[ 7783, 7827 ], [ 11583, 11606 ], [ 11749, 11793 ], [ 21158, 21216 ], [ 21222, 21297 ], [ 21303, 21378 ], [ 21384, 21452 ],
		[ 21674, 21681 ], [ 21884, 21902 ], [ 21970, 21978 ], [ 22011, 22017 ], [ 22294, 22317 ], [ 22453, 22492 ], [ 22580, 22612 ],
		[ 22660, 22667 ], [ 22715, 22722 ], [ 22770, 22786 ], [ 22972, 23004 ], [ 23052, 23059 ], [ 23107, 23114 ], [ 23162, 23169 ],
		[ 23217, 23233 ], [ 23339, 23371 ], [ 24157, 24176 ], [ 24312, 24355 ], [ 24365, 24437 ], [ 24447, 24493 ], [ 25663, 25678 ],
		[ 26984, 27037 ], [ 27438, 27492 ], [ 27663, 27718 ], [ 29027, 29066 ], [ 29542, 29560 ], [ 29961, 30020 ], [ 30684, 30743 ],
		[ 31511, 31566 ], [ 31956, 32008 ], [ 32112, 32170 ], [ 32180, 32214 ], [ 32801, 32819 ], [ 33073, 33127 ], [ 33148, 33165 ],
		[ 33186, 33204 ], [ 33225, 33239 ], [ 33260, 33270 ], [ 33291, 33312 ], [ 33333, 33355 ], [ 33376, 33380 ], [ 33401, 33405 ],
		[ 33426, 33430 ], [ 33451, 33455 ], [ 33476, 33480 ], [ 34117, 34178 ], [ 34272, 34276 ], [ 34304, 34308 ], [ 34336, 34341 ],
		[ 34369, 34373 ], [ 34401, 34405 ], [ 34433, 34437 ], [ 34465, 34469 ], [ 34497, 34501 ], [ 34529, 34533 ], [ 34561, 34565 ],
		[ 34961, 34965 ], [ 34992, 34996 ], [ 35053, 35067 ], [ 35621, 35645 ], [ 35761, 35792 ], [ 36209, 36256 ], [ 37568, 37619 ],
		[ 38939, 38964 ], [ 40224, 40240 ], [ 41177, 41208 ], [ 41222, 41254 ], [ 41268, 41308 ], [ 41322, 41363 ], [ 42024, 42040 ],
		[ 42935, 42993 ], [ 44479, 44503 ], [ 46608, 46642 ], [ 47022, 47069 ], [ 47103, 47121 ], [ 50706, 50740 ], [ 51120, 51167 ],
		[ 51201, 51219 ], [ 53904, 53921 ], [ 54590, 54628 ], [ 55735, 55776 ], [ 55790, 55846 ], [ 55892, 55908 ], [ 56013, 56040 ],
		[ 56110, 56150 ], [ 56468, 56491 ], [ 56619, 56635 ], [ 56649, 56688 ], [ 57587, 57620 ], [ 57630, 57680 ], [ 57781, 57829 ],
		[ 58536, 58590 ], [ 58608, 58641 ], [ 58812, 58834 ], [ 59199, 59217 ], [ 59509, 59557 ], [ 59575, 59609 ], [ 59699, 59722 ],
		[ 59805, 59828 ], [ 60418, 60447 ], [ 60560, 60631 ], [ 60896, 60970 ], [ 60980, 61011 ], [ 61314, 61359 ], [ 62197, 62261 ],
		[ 62433, 62470 ], [ 62683, 62713 ], [ 76732, 76799 ], [ 77136, 77157 ], [ 78425, 78468 ], [ 79573, 79619 ], [ 79701, 79760 ],
		[ 79766, 79805 ], [ 80001, 80057 ], [ 80063, 80102 ], [ 80306, 80372 ], [ 80500, 80562 ], [ 80700, 80773 ], [ 80922, 80980 ],
		[ 81567, 81639 ], [ 82071, 82134 ], [ 82447, 82474 ], [ 83159, 83183 ], [ 83334, 83396 ], [ 83989, 84010 ], [ 84193, 84237 ],
		[ 84239, 84355 ], [ 84357, 84397 ], [ 84399, 84476 ], [ 84478, 84501 ], [ 84503, 84527 ], [ 84642, 84656 ], [ 85327, 85355 ],
		[ 86931, 87002 ], [ 87012, 87066 ], [ 87640, 87682 ], [ 88183, 88224 ], [ 88791, 88830 ], [ 88836, 88848 ], [ 88854, 89065 ],
		[ 89430, 89489 ], [ 89560, 89626 ], [ 89646, 89671 ], [ 92007, 92048 ], [ 92071, 92102 ], [ 92173, 92206 ], [ 92217, 92256 ],
		[ 93278, 93309 ], [ 93534, 93561 ], [ 95540, 95574 ], [ 98734, 98761 ], [ 99073, 99090 ], [ 99544, 99567 ], [ 99912, 99929 ],
		[ 102323, 102355 ], [ 102361, 102387 ], [ 102393, 102424 ], [ 102430, 102458 ], [ 102464, 102490 ], [ 102496, 102529 ],
		[ 102535, 102568 ], [ 103158, 103225 ], [ 103547, 103556 ], [ 103764, 103802 ], [ 104048, 104077 ], [ 104676, 104705 ],
		[ 105176, 105217 ], [ 105223, 105240 ], [ 105449, 105486 ], [ 105592, 105631 ], [ 105637, 105651 ], [ 105657, 105727 ],
		[ 106004, 106045 ], [ 106052, 106069 ], [ 106259, 106289 ], [ 106390, 106429 ], [ 106436, 106450 ], [ 106457, 106523 ],
		[ 107736, 107777 ], [ 107986, 108023 ], [ 108036, 108075 ], [ 108430, 108471 ], [ 108661, 108691 ], [ 108706, 108745 ],
		[ 108858, 108909 ], [ 108973, 109028 ], [ 113648, 113658 ], [ 113856, 113902 ], [ 114365, 114388 ], [ 115372, 115428 ],
		[ 116105, 116118 ], [ 116738, 116764 ], [ 117478, 117487 ], [ 118626, 118657 ], [ 118663, 118721 ], [ 118727, 118786 ],
		[ 118792, 118849 ], [ 119137, 119194 ], [ 119286, 119297 ], [ 123195, 123218 ], [ 123344, 123372 ], [ 123558, 123578 ],
		[ 124068, 124096 ], [ 125485, 125568 ], [ 126960, 126985 ], [ 128298, 128328 ], [ 128453, 128499 ], [ 129520, 129547 ],
		[ 129666, 129738 ], [ 130801, 130829 ], [ 131060, 131125 ], [ 131798, 131825 ], [ 132223, 132251 ], [ 134095, 134123 ],
		[ 134474, 134500 ], [ 134749, 134759 ], [ 135629, 135660 ], [ 135839, 135855 ], [ 137762, 137790 ], [ 138400, 138425 ],
		[ 139211, 139235 ], [ 148499, 148512 ], [ 149315, 149374 ], [ 149388, 149436 ], [ 149571, 149616 ], [ 149715, 149762 ],
		[ 149865, 149915 ], [ 150682, 150741 ], [ 150755, 150803 ], [ 150938, 150983 ], [ 151082, 151129 ], [ 151232, 151282 ],
		[ 151723, 151772 ], [ 152372, 152419 ], [ 152424, 152438 ], [ 152443, 152761 ], [ 152784, 152855 ], [ 152865, 152897 ],
		[ 155415, 155428 ], [ 157414, 157438 ], [ 159132, 159202 ], [ 159208, 159234 ], [ 159385, 159451 ], [ 159461, 159519 ],
		[ 159529, 159599 ], [ 159609, 159623 ], [ 166421, 166475 ], [ 176468, 176522 ], [ 179319, 179373 ], [ 183188, 183242 ],
		[ 186241, 186280 ], [ 187445, 187465 ], [ 187511, 187547 ], [ 187649, 187719 ], [ 188279, 188341 ], [ 188359, 188417 ],
		[ 188435, 188478 ], [ 189116, 189154 ], [ 189180, 189207 ], [ 191723, 191785 ], [ 191803, 191861 ], [ 191879, 191922 ],
		[ 192866, 192896 ], [ 193014, 193027 ], [ 193501, 193536 ]
	].map( ([from, to]) => ({ from, to, data: `${from}-${to}` }) );
}