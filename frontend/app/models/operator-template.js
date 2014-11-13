import DS from "ember-data";

var OperatorTemplate = DS.Model.extend({
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string')
});

OperatorTemplate.reopenClass({
  FIXTURES: [
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
  ]
});

export default OperatorTemplate;
