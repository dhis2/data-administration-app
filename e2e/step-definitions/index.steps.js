var steps = [
  require('./homepage.steps'),
];

module.exports = function() {
  steps.forEach(function(step) {
    step.call(this);
  }.bind(this));
};