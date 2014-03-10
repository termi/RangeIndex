"use strict";

const BUILD_VERSION = '%%BUILD_VERSION%%';

const assert = ((expect, msg) => { if (expect != true)throw new Error(msg || "") });
const assign = (t, s) => {
	for ( var p in s ) if ( s.hasOwnProperty(p) ) {
		t[p] = s[p];
	}
	return t;
};

class RangeIndex {
	constructor() {
		this.reset();
	}

	reset() {
		this.indexFrom = [];
		this.recordsCount = 0;
		//TODO::this.indexTo = [];
	}

	put(from, to, data) {
		this.recordsCount++;

		let index = this.indexFrom
			, indexeKeys = `${from}`.split("")
			, {length} = indexeKeys// key deep
			, maxLimitProp = `__maxTo${length}`
			, minLimitProp = `__minFrom${length}`
			, countLimitProp = `__count${length}`
		;

		function updateIndex(index) {
			if ( !(index[maxLimitProp] >= to) ) {
				index[maxLimitProp] = to;
			}
			if ( !(index[minLimitProp] <= from) ) {
				index[minLimitProp] = from;
			}
			if ( !(index[`__maxTo`] >= to) ) {
				index[`__maxTo`] = to;
			}
			if ( !(index[`__minFrom`] <= from) ) {
				index[`__minFrom`] = from;
			}
			if ( index[countLimitProp] === void 0 ) {
				index[countLimitProp] = 1;
			}
			else {
				index[countLimitProp]++;
			}
			if ( index[`__count`] === void 0 ) {
				index[`__count`] = 1;
			}
			else {
				index[`__count`]++;
			}
		}

		updateIndex(index);

		for( let indexKey of indexeKeys ) {
			indexKey = indexKey | 0;

			index = index[indexKey] || (index[indexKey] = []);

			updateIndex(index);
		}
		(index.__data || (index.__data = [])).push({from, to, data});
	}

	find(from, to = from, options = {}) {
//		if ( from > to ) throw new Error("'from' value must be <= 'to' value");
		const index = this.indexFrom
			, result = []
			, {filter} = options
		;

		let pendingFromValue
			, pendingToValue
		;

		let fromKey = `${from}`
			, fromKeys = [ for( v of fromKey.split("") ) v | 0 ]
			, fromDeep = fromKeys.length
			, maxLimitProp = `__maxTo${fromDeep}`
		;

		let localTo
			, toKeys = `${to}`.split("")
			, toDeep = toKeys.length
		;

//		if ( fromDeep > 9 || toDeep > 9 ) throw new Error("'from' or 'to' value > 999999999 unsuported");//for 999999999 index file size must be ~1Gib

		// TODO:: Limit 'from': 'from' < index[`__minFrom`] ? 'from' = index[`__minFrom`]
		// TODO:: Limit 'to': 'to' > index[`__maxTo`] ? 'to' = index[`__maxTo`]

		if ( fromDeep < toDeep ) {
			pendingToValue = to;

			localTo = fromKey.replace(/\d/g, "9") | 0;

			pendingFromValue = localTo + 1;
		}
		else {
			localTo = to;
		}

		let subIndex
			, lastFromNumberIndex = fromDeep - 1
			, lastKey = fromKeys[lastFromNumberIndex]
		;

		while( from <= localTo ) {
			if ( !subIndex ) {
				subIndex = index;
				for( let fromKeyIndex = 0, fromKey ; fromKeyIndex < fromDeep - 1 ; fromKeyIndex++ ) {
					fromKey = fromKeys[fromKeyIndex] | 0;
					subIndex = subIndex[fromKey];
					if ( subIndex ) {
						if ( subIndex[maxLimitProp] < from ) {//check `__maxTo${deep}` and `__maxFrom${deep}`
							//fast check: fragments in this index has changes outside current recort
							subIndex = void 0;
						}
					}
					if ( !subIndex ) {
						break;
					}
				}
			}

			if ( subIndex ) {
				let subIndexContainer = subIndex[lastKey];

				if ( subIndexContainer && subIndexContainer[maxLimitProp] >= localTo ) {
					subIndexContainer = subIndexContainer.__data;
					if ( subIndexContainer ) {
						for( let record of subIndexContainer ) {
							let {to: foundTo} = record;

							if ( foundTo <= to && (!filter || filter(record.data, record.from, record.to) !== false) ) {
								result.push(record.data);
							}
						}
					}
				}
			}

			from++;
			lastKey = fromKeys[lastFromNumberIndex] = lastKey + 1;
			if ( lastKey > 9 ) {
				fromKey = `${from}`;
				fromKeys = fromKey.split("").map( (v) => v | 0 );
				lastKey = 0;
				subIndex = void 0;
			}
		}

		if ( pendingFromValue ) {
			result.push(...this.find(pendingFromValue, pendingToValue, options));
		}

		return result;
	}

	findOuter(innerFrom, innerTo = innerFrom, options = {}) {
		const result = []
			, {filter, sort} = options
			, sortKeys = typeof sort === 'function' ? [] : void 0
		;

		let intValue = innerFrom | 0
			, fromKeys = [ for( v of `${intValue}`.split("") ) v | 0 ]
			, fromDeep = fromKeys.length
			, maxLimitProp = `__maxTo${fromDeep}`
			, minLimitProp = `__minFrom${fromDeep}`
		;

		let subIndex = this.indexFrom
			, stashedIndexes = []
			, currentDeep = 1
			, currentDeepDiff = fromDeep - currentDeep
		;

		let checkRecords = (records = []) => {
			for ( let {from, to, data} of records ) {
				if ( from <= innerFrom && to >= innerTo && (!filter || filter(data, from, to) !== false) ) {
					result.unshift(data);
					
					if ( sortKeys ) {
						sortKeys.push({from, to, reverseIndex: sortKeys.length});
					}
				}
			}
		}

		while( intValue >= 0 ) {
			let keyValue = fromKeys[currentDeep - 1];
			let indexValue;

			let decrementKeys = true;

			if ( indexValue = subIndex[keyValue] ) {
				if ( indexValue[minLimitProp] <= innerFrom && indexValue[maxLimitProp] >= innerTo ) {
					if ( currentDeep === fromDeep ) {
						checkRecords(indexValue.__data);
					}
					else {
						currentDeep++;
						currentDeepDiff = fromDeep - currentDeep;
						stashedIndexes.push(subIndex);
						subIndex = indexValue;

						decrementKeys = false;
					}
				}
			}

			if ( decrementKeys ) {
				let updateKeys = true;

				if ( currentDeepDiff ) {
					intValue = intValue - (1 + (fromKeys.slice(currentDeep).join("") | 0));
				}
				else {//max deep
					intValue--;
					updateKeys = (fromKeys[currentDeep - 1] = fromKeys[currentDeep - 1] - 1) < 0;
				}

				if ( updateKeys ) {
					fromKeys = `${intValue}`.split("").map( (v) => v | 0 );

					if ( fromDeep !== fromKeys.length ) {
						fromDeep = fromKeys.length;
						maxLimitProp = `__maxTo${fromDeep}`;
						minLimitProp = `__minFrom${fromDeep}`;
					}

					if ( currentDeep > 1 ) {
						subIndex = stashedIndexes.pop();
						currentDeep--;
						currentDeepDiff = fromDeep - currentDeep;
					}
				}
			}
		}

		if ( sortKeys ) {//sort result
			let {length} = result;
			return sortKeys.sort(sort).map( ({reverseIndex}) => result[length - reverseIndex - 1] );
		}

		return result;
	}
}

RangeIndex.version = BUILD_VERSION;

module.exports = RangeIndex;
