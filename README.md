# RangeIndex

Minimalistic helper for simple operation: put a bunch of [from, to] values and get any selection of them

## API

`put(from: integer, to: integer, record: Object): RangeIndex` - put record to the index

`find(from: integer, to: integer, options: Object?): Array` - find records in range of `from`-`to`

`findOuter(innerFrom: integer, innerTo: integer, options: Object?): Array` - find records which `from`-`to` range contains `innerFrom`-`innerTo` range

Note: the result of `findOuter` is unsorted list of records. The records in this result would be in a different order than they were put.
Specify the options.sort to sort result.

```javascript
options = {
    sort: function(Object.<from, to>, Object.<from, to>){} // For findOuter method only. Callback for sorting result
    filter: function(record: Object, from: number, to: number){} // Callback for filtering result
}
```



### Example
```javascript
const rangeIndex = new RangeIndex()
	, dataset = [
		{from: 0, to: 10, data: '0-10'}, {from: 0, to: 20, data: '0-20'}, {from: 0, to: 50, data: '0-50'}
		, {from: 50, to: 100, data: '50-100'}, {from: 50, to: 120, data: '50-120'}, {from: 50, to: 150, data: '50-150'}
		, {from: 150, to: 1000, data: '150-1000'}
		, {from: 250, to: 1200, data: '250-1200'}
		, {from: 350, to: 2000, data: '350-2000'}
	]
;
for ( let {from, to, data} of dataset ) {
	rangeIndex.put(from, to, data);
}
rangeIndex.find(0, 500);//["0-10", "0-20", "0-50", "50-100", "50-120", "50-150"]
rangeIndex.findOuter(300, 500);//["150-1000", "250-1200"]

```

## Install

`npm install rangeindex`

## License

MIT
