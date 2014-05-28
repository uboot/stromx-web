/* global App */

App.Parameter = DS.Model.extend({
  title: DS.attr('string'),
  type: DS.attr('string'),
  stringValue: DS.attr('string'),
  numberValue: DS.attr('number'),
  minimum: DS.attr('number'),
  maximum: DS.attr('number'),
  state: DS.attr('string'),
  writable: DS.attr('boolean'),
  descriptions: DS.hasMany('enumDescription', {async: true})
});

App.Parameter.FIXTURES = [
  {
    id: 1,
    title: 'Port',
    type: 'int',
    stringValue: '',
    numberValue: 50123,
    minimum: 49152,
    maximum: 65535,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 2,
    title: 'Data flow',
    type: 'enum',
    stringValue: '',
    numberValue: 2,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: false,
    descriptions: [0, 1, 2]
  },
  {
    id: 3,
    title: 'Kernel size',
    type: 'float',
    stringValue: '',
    numberValue: 2.5,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 4,
    title: 'Coefficient',
    type: 'float',
    stringValue: '',
    numberValue: 2.5,
    minimum: 0,
    maximum: 0,
    state: 'timedOut',
    writable: true,
    descriptions: []
  },
  {
    id: 6,
    title: 'Offset',
    type: 'float',
    stringValue: '',
    numberValue: 4.5,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: false,
    descriptions: []
  },
  {
    id: 5,
    title: 'Host',
    type: 'string',
    stringValue: 'localhost',
    numberValue: 0,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 7,
    title: 'Kernel type',
    type: 'int',
    stringValue: '',
    numberValue: 4,
    minimum: 0,
    maximum: 0,
    state: 'accessFailed',
    writable: true,
    descriptions: []
  },
  {
    id: 8,
    title: 'Matrix parameter',
    type: 'matrix',
    stringValue: '3 x 3 float',
    numberValue: 0,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 9,
    title: 'Strange type',
    type: 'none',
    stringValue: '',
    numberValue: 0,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 10,
    title: 'Trigger',
    type: 'trigger',
    stringValue: '',
    numberValue: 0,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 11,
    title: 'Bool property',
    type: 'bool',
    stringValue: '',
    numberValue: 0,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: []
  },
  {
    id: 12,
    title: 'Kernel type',
    type: 'enum',
    stringValue: '',
    numberValue: 3,
    minimum: 0,
    maximum: 0,
    state: 'current',
    writable: true,
    descriptions: [3, 4, 5]
  },
];