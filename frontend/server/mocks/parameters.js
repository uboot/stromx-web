module.exports = function(app) {
  var express = require('express');
  var parametersRouter = express.Router();
  parametersRouter.get('/', function(req, res) {
    res.send({"parameters":[
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
        operator: 1,
        observers: []
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
        operator: 2,
        observers: []
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
        operator: 2,
        observers: [0]
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
        operator: 2,
        observers: []
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
        operator: 2,
        observers: []
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
        operator: 3,
        observers: []
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
        operator: 2,
        observers: []
      },
      {
        id: 8,
        title: 'Matrix parameter',
        variant: 'matrix',
        value: {
          rows: 3,
          cols: 4,
          values: [
            [10, 10, 200, 200],
            [10, 20, 200, 300],
            [10, 30, 200, 400]
          ]
        },
        minimum: 0,
        maximum: 0,
        state: 'current',
        writable: true,
        descriptions: [],
        operator: 4,
        observers: []
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
        operator: 4,
        observers: []
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
        operator: 4,
        observers: []
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
        operator: 4,
        observers: []
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
        operator: 2,
        observers: []
      }
    ]});
  });
  app.use('/api/parameters/*', parametersRouter);
};
