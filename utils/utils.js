export function format(value) {
	let _value = value || 0;
	_value = _value.toLocaleString(undefined, { maximumFractionDigits: 2 });
	if (_value.includes('.') && _value.split('.')[1].length === 1) {
		return _value += '0';
	} else if (!_value.includes('.')) {
		return parseFloat(value || 0).toFixed(2);
	}
	return _value;
}

export function formatComma(value) {
	value = value ? parseFloat(value) : 0;
	return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatNumber(val) {
	return +parseFloat(val).toFixed(2);
}

export function formatBy(value, sufix) {
	let _value = value;
	return _value ? parseFloat(_value).toFixed(sufix || 2) : '0.00';
}

export function roundUpNearest10(num) {
	return Math.ceil(num / 10) * 10;
}

export function possitiveOrZero(value) {
	return value > 0 ? formatNumber(value) : 0;
}

export function sum(arr, prop) {
	return arr.reduce((accumulator, object) => {
		return accumulator + (prop ? +object[prop] : object);
	}, 0)
}
export function groupBy(arr = [], groupByProperty, sumByProperty) {
	let helper = {};
	let result = arr.reduce(function (r, o) {
		let key = o[groupByProperty]?.value || o[groupByProperty];

		if (!helper[key]) {
			helper[key] = Object.assign({}, o); // create a copy of o
			r.push(helper[key]);
		} else {
			helper[key][sumByProperty] += o[sumByProperty];
		}

		return r;
	}, []);

	return result;
}