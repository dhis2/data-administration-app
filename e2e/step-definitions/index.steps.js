const steps = [
    require('./shared.steps'),
    require('./home.steps'),
    require('./help.steps'),
    require('./sideMenu.steps'),
    require('./dataStatistics.steps'),
    require('./dataIntegrity.steps'),
    require('./minMaxValueGeneration.steps'),
    require('./maintenance.steps'),
    require('./lockExceptions.steps'),
    require('./resourceTables.steps'),
];

module.exports = function () {
    steps.forEach(function (step) {
        step.call(this);
    }.bind(this));
};
