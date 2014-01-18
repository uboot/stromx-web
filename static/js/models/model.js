App.File = DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  opened: DS.attr('boolean'),
  stream: DS.hasMany('stream', {async: true})
});

// disable belongsTo because of
// http://discuss.emberjs.com/t/ember-data-fixture-adapter-saving-record-loses-has-many-relationships/2821/6
App.Stream = DS.Model.extend({
  name: DS.attr('string'),
  file: DS.belongsTo('file'),
  active: DS.attr('boolean'),
  paused: DS.attr('boolean')
});

App.File.FIXTURES = [
  {
    id: 1,
    name: 'test.stromx',
    content: '',
    opened: true,
    stream: [2]
  },
  {
    id: 2,
    name: 'hough.stromx',
    content: '',
    opened: false,
    stream: []
  }
];

App.Stream.FIXTURES = [
  {
    id: 2,
    name: 'Stream one',
    file: 1,
    active: false,
    paused: false
  },
  {
    id: 3,
    name: 'Stream two',
    active: false,
    paused: false
  }
];