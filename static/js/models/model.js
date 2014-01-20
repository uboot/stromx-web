App.File = DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  opened: DS.attr('boolean'),
  stream: DS.hasMany('stream', {async: true})
});

App.Stream = DS.Model.extend({
  name: DS.attr('string'),
  file: DS.belongsTo('file'),
  active: DS.attr('boolean'),
  paused: DS.attr('boolean')
});

App.Error = DS.Model.extend({
  time: DS.attr('date'),
  description: DS.attr('string')
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

App.Error.FIXTURES = [
  {
    id: 1,
    time: new Date('2014-01-20T12:47:07+00:00'),
    description: "Failed to open stream file"
  },
  {
    id: 2,
    time: new Date('2014-01-20T13:00:00+00:00'),
    description: "Failed to initialize blur operator"
  }
];