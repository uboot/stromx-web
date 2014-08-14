/* global App */

App.Connector = DS.Model.extend({
  title: DS.attr('string'),
  type: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true})
});

App.Connector.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    type: 'input',
    operator: 2
  },
  {
    id: 2,
    title: 'Number',
    type: 'input',
    operator: 1
  },
  {
    id: 3,
    title: 'Destination image',
    type: 'input',
    operator: 2
  },
  {
    id: 4,
    title: 'Output image',
    type: 'output',
    operator: 2
  },
  {
    id: 5,
    title: 'Generated number',
    type: 'output',
    operator: 0
  },
  {
    id: 6,
    title: 'Received image',
    type: 'output',
    operator: 3
  }
];
