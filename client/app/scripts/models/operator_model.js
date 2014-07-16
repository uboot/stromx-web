/* global App */

App.Operator = DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string'),
  parameters: DS.hasMany('parameter', {async: true}),
  x: DS.attr('number'),
  y: DS.attr('number'),
  inputs: DS.hasMany('connector', {async: true}),
  outputs: DS.hasMany('connector', {async: true})
});

App.Operator.FIXTURES = [
  {
    id: 0,
    name: 'Generate numbers',
    status: 'initialized',
    type: 'Counter',
    package: 'runtime',
    version: '0.3.0',
    parameters: [],
    x: 20,
    y: 20,
    inputs: [],
    outputs: [5]
  },
  {
    id: 1,
    name: 'Send numbers',
    status: 'initialized',
    type: 'Send',
    package: 'runtime',
    version: '0.3.0',
    parameters: [1],
    x: 160,
    y: 40,
    inputs: [2],
    outputs: []
  },
  {
    id: 2,
    name: 'Blur the image',
    status: 'none',
    type: 'Blur',
    package: 'cv::imgproc',
    version: '0.0.1',
    parameters: [2, 3, 4, 6, 7, 12],
    x: 240,
    y: 40,
    inputs: [1, 3],
    outputs: [4]
  },
  {
    id: 3,
    name: 'Receive remote images',
    status: 'none',
    type: 'Receive',
    package: 'runtime',
    version: '0.0.1',
    parameters: [5],
    x: 40,
    y: 160,
    inputs: [],
    outputs: [6]
  },
  {
    id: 4,
    name: 'Test operator',
    status: 'none',
    type: 'Test',
    package: 'mypackage',
    version: '0.0.1',
    parameters: [8, 9, 10, 11],
    x: 120,
    y: 160,
    inputs: [],
    outputs: []
  }
];
