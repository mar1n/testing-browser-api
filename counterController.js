const counterValue = { counter: 0 };
const addValue = function() {
    counterValue.counter += 1;
};

module.exports = { counterValue, addValue}