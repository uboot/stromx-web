/* global App */

// disable belongsTo because of
// http://discuss.emberjs.com/t/ember-data-fixture-adapter-saving-record-loses-has-many-relationships/2821/6
App.Stream = DS.Model.extend({
  name: DS.attr('string'),
  file: DS.belongsTo('file'),
  active: DS.attr('boolean'),
  paused: DS.attr('boolean'),
  saved: DS.attr('boolean'),
  operators: DS.hasMany('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true}),
  views: DS.hasMany('view', {async: true})
});

App.Stream.FIXTURES = [
  {
    id: 2,
    name: 'Stream one',
    file: 1,
    active: false,
    paused: false,
    operators: [0, 1, 2, 4],
    connections: [1, 2],
    views: [1]
  },
  {
    id: 3,
    name: 'Stream two',
    file: 2,
    active: false,
    paused: false,
    operators: [],
    connections: [],
    views: []
  }
];
