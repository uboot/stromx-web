/* global App */

App.Connector = DS.Model.extend({
  title: DS.attr('string'),
  connectorType: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true}),
  observers: DS.hasMany('connector-observers', {async: true})
});

App.Connector.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    connectorType: 'input',
    operator: 2,
    connections: [],
    observers: []
  },
  {
    id: 2,
    title: 'Number',
    connectorType: 'input',
    operator: 1,
    connections: [1],
    observers: [2, 3]
  },
  {
    id: 3,
    title: 'Destination image',
    connectorType: 'input',
    operator: 2,
    connections: [2],
    observers: []
  },
  {
    id: 4,
    title: 'Output image',
    connectorType: 'output',
    operator: 2,
    connections: [],
    observers: []
  },
  {
    id: 5,
    title: 'Generated number',
    connectorType: 'output',
    operator: 0,
    connections: [1, 2],
    observers: [0]
  },
  {
    id: 6,
    title: 'Received image',
    connectorType: 'output',
    operator: 3,
    connections: [],
    observers: []
  }
];
