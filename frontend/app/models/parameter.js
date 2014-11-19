import DS from "ember-data";

var Parameter = DS.Model.extend({
  title: DS.attr('string'),
  variant: DS.attr('string'),
  value: DS.attr(),
  minimum: DS.attr('number'),
  maximum: DS.attr('number'),
  state: DS.attr('string'),
  writable: DS.attr('boolean'),
  operator: DS.belongsTo('operator', {async: true}),
  descriptions: DS.hasMany('enum-description', {async: true})
});

Parameter.reopenClass({
  FIXTURES: [
    {
      id: 1,
      title: 'Port',
      variant: 'int',
      value: 50123,
      minimum: 49152,
      maximum: 65535,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 1
    },
    {
      id: 2,
      title: 'Data flow',
      variant: 'enum',
      value: 2,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: false,
      descriptions: [0, 1, 2],
      operator: 2
    },
    {
      id: 3,
      title: 'Kernel size',
      variant: 'float',
      value: 2.5,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 2
    },
    {
      id: 4,
      title: 'Coefficient',
      variant: 'float',
      value: 2.5,
      minimum: 0,
      maximum: 0,
      state: 'timedOut',
      writable: true,
      descriptions: [],
      operator: 2
    },
    {
      id: 6,
      title: 'Offset',
      variant: 'float',
      value: 4.5,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: false,
      descriptions: [],
      operator: 2
    },
    {
      id: 5,
      title: 'Host',
      variant: 'string',
      value: 'localhost',
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 3
    },
    {
      id: 7,
      title: 'Kernel variant',
      variant: 'int',
      value: 4,
      minimum: 0,
      maximum: 0,
      state: 'accessFailed',
      writable: true,
      descriptions: [],
      operator: 2
    },
    {
      id: 8,
      title: 'Matrix parameter',
      variant: 'matrix',
      stringValue: '3 x 3 float',
      numberValue: 0,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 4
    },
    {
      id: 9,
      title: 'Strange variant',
      variant: 'none',
      value: null,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 4
    },
    {
      id: 10,
      title: 'Trigger',
      variant: 'trigger',
      value: null,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 4
    },
    {
      id: 11,
      title: 'Bool property',
      variant: 'bool',
      value: false,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [],
      operator: 4
    },
    {
      id: 12,
      title: 'Kernel variant',
      variant: 'enum',
      value: 3,
      minimum: 0,
      maximum: 0,
      state: 'current',
      writable: true,
      descriptions: [3, 4, 5],
      operator: 2
    }
  ]
});

export default Parameter;
