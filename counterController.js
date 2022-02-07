const counterValue = { counter: 0 };
const addValue = function(value) {
    counterValue.counter += value;
};

module.exports = { counterValue, addValue}