var _ = require('lodash');

function createSummary(summary) {
    
    // Just pull out the miminum parts for each failure
    var failures = [];
    summary.run.failures.forEach(function(failure) {
        failures.push({
            'Parent': {
                'Name': failure.parent.name,
                'Id' : failure.parent.id
            },
            'Source': {
                'Name': failure.source.name,
                'Id' : failure.source.id
            },
            'Error': {
                'Message': failure.error.message,
                'Test' : failure.error.test
            }
        });
    });

    // Group run executions by iteration. Calculate aggregate time by iteration
    // and each individual's response time.
    var iterations = [];
    var groupedIterations = _(summary.run.executions)
                            .groupBy(e => e.cursor.iteration)
                            .map((value, key) => ({
                                iteration: key, 
                                executions: value,
                                totalTime: _.sumBy(value, 'response.responseTime')
                            }))
                            .value();
    groupedIterations.forEach(function(groupedIteration) {
        iterations.push({
            'Iteration': groupedIteration.iteration + 1,
            'TotalTime': groupedIteration.totalTime,
            'Requests': groupedIteration.executions.map((value, key) => ({
                'Name': value.item.name,
                'ResponseTime': value.response.responseTime
            }))
        });
    });

    // Build main object with just the bits needed plus the slimmed down failures
    var result = {};
    Object.assign(result, {
        'Collection': {
            'Info': {
                'Name': summary.collection.name,
                'Id': summary.collection.id
            }
        },
        'Run': {
            'Stats': {
                "Requests" : summary.run.stats.requests,
                "Assertions" : summary.run.stats.assertions
            },
            'Failures': failures,
            'Timings' : summary.run.timings
        },
        'IterationsTimings': {
            'Iterations': iterations
        }
    });
    return result;
}

module.exports = function(newman, options) {
    newman.on('beforeDone', function(err, data) {
        if (err) { return; }

        newman.exports.push({
            name: 'newman-reporter-json-latency-summary',
            default: 'summary.json',
            path:  options.jsonLatencySummary,
            content: JSON.stringify(createSummary(data.summary))
        });
    });
};
