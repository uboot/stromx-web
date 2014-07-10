/* global App */

App.Connector = DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator')
});

App.Connector.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    operator: 2
  },
  {
    id: 2,
    title: 'Number',
    operator: 1
  },
  {
    id: 3,
    title: 'Destination image',
    operator: 2
  },
  {
    id: 4,
    title: 'Output image',
    operator: 2
  },
  {
    id: 5,
    title: 'Generated number',
    operator: 0
  },
  {
    id: 6,
    title: 'Received image',
    operator: 3
  }
];