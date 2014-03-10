
const {default: reporter} = require('nodeunit').reporters
	, path = require('path');

reporter.run(['specs/rangeIndex'].map( (moduleName) => path.join('test', `${moduleName}.js`) ));
