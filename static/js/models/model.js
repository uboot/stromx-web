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
  paused: DS.attr('boolean'),
  operators: DS.hasMany('operator', {async: true})
});

App.Error = DS.Model.extend({
  time: DS.attr('date'),
  description: DS.attr('string')
});

App.Operator = DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string'),
  parameters: DS.hasMany('parameter', {async: true})
});

App.Parameter = DS.Model.extend({
  title: DS.attr('string'),
  type: DS.attr('string'),
  valueString: DS.attr('string'),
  valueNumber: DS.attr('number'),
  valueBoolean: DS.attr('boolean'),
  minimum: DS.attr('number'),
  maximum: DS.attr('number'),
  descriptions: DS.hasMany('EnumDescription', {async: true})
});

App.EnumDescription = DS.Model.extend({
  value: DS.attr('number'),
  title: DS.attr('string')
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
    paused: false,
    operators: [0, 1, 2]
  },
  {
    id: 3,
    name: 'Stream two',
    file: 2,
    active: false,
    paused: false,
    operators: []
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

App.Operator.FIXTURES = [
  {
    id: 0,
    name: 'Generate numbers',
    status: 'initialized',
    type: 'Counter',
    package: 'runtime',
    version: '0.3.0',
    parameters: []
  },
  {
    id: 1,
    name: 'Send numbers',
    status: 'initialized',
    type: 'Send',
    package: 'runtime',
    version: '0.3.0',
    parameters: [1]
  },
  {
    id: 2,
    name: 'Blur the image',
    status: 'none',
    type: 'Blur',
    package: 'cv::imgproc',
    version: '0.0.1',
    parameters: [2]
  }
];

App.Parameter.FIXTURES = [
  {
    id: 1,
    title: 'Port',
    type: 'int',
    valueString: '',
    valueNumber: 50123,
    valueBoolean: false,
    minimum: 49152,
    maximum: 65535,
    descriptions: []
  },
  {
    id: 2,
    title: 'Data flow',
    type: 'int',
    valueString: '',
    valueNumber: 0,
    valueBoolean: false,
    minimum: 0,
    maximum: 0,
    descriptions: [0, 1, 2]
  }
];

App.EnumDescription.FIXTURES = [
  {
    id: 0,
    value: 0,
    title: 'Manual'
  },
  {
    id: 1,
    value: 1,
    title: 'Allocate'
  },
  {
    id: 2,
    value: 2,
    title: 'In place'
  }
];