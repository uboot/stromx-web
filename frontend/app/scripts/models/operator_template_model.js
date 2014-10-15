/* global App */

App.OperatorTemplate = DS.Model.extend({
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string')
});

App.Operator.FIXTURES = [
  {
    id: 0,
    type: 'Counter',
    package: 'runtime',
    version: '0.3.0'
  },
  {
    id: 1,
    type: 'Send',
    package: 'runtime',
    version: '0.3.0'
  },
  {
    id: 4,
    type: 'Test',
    package: 'mypackage',
    version: '0.0.1'
  }
];
