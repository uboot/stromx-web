module.exports = function(app) {
  var express = require('express');
  var parametersRouter = express.Router();
  parametersRouter.get('/', function(req, res) {
    res.send({"parameters":[
      {
        id: 1,
        title: 'Port',
        variant: {
          ident: 'int',
          title: 'Int32'
        },
        value: 50123,
        minimum: 49152,
        maximum: 65535,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'inactive',
        behavior: 'persistent',
        descriptions: [],
        operator: 1,
        observers: []
      },
      {
        id: 2,
        title: 'Data flow',
        variant: {
          ident: 'enum',
          title: 'Enum'
        },
        value: 2,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'none',
        behavior: 'persistent',
        descriptions: [0, 1, 2],
        operator: 2,
        observers: []
      },
      {
        id: 3,
        title: 'Kernel size',
        variant: {
          ident: 'float',
          title: 'Float32'
        },
        value: 2.5,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 2,
        observers: [0]
      },
      {
        id: 4,
        title: 'Coefficient',
        variant: {
          ident: 'float',
          title: 'Float32'
        },
        value: 2.5,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'timedOut',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 2,
        observers: []
      },
      {
        id: 6,
        title: 'Offset',
        variant: {
          ident: 'float',
          title: 'Float32'
        },
        value: 4.5,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 2,
        observers: []
      },
      {
        id: 5,
        title: 'Host',
        variant: {
          ident: 'string',
          title: 'String'
        },
        value: 'localhost',
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'inactive',
        behavior: 'persistent',
        descriptions: [],
        operator: 3,
        observers: []
      },
      {
        id: 7,
        title: 'Kernel variant',
        variant: {
          ident: 'enum',
          title: 'Enum'
        },
        value: 4,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'accessFailed',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 2,
        observers: []
      },
      {
        id: 8,
        title: 'Matrix parameter',
        variant: {
          ident: 'matrix',
          title: 'Int Matrix'
        },
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
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      },
      {
        id: 9,
        title: 'Strange variant',
        variant: {
          ident: 'none',
          title: ''
        },
        value: null,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'inactive',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      },
      {
        id: 10,
        title: 'Trigger',
        variant: {
          ident: 'trigger',
          title: 'Trigger'
        },
        value: null,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      },
      {
        id: 11,
        title: 'Inactive bool property',
        variant: {
          ident: 'bool',
          title: 'Bool'
        },
        value: false,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      },
      {
        id: 12,
        title: 'Kernel variant',
        variant: {
          ident: 'enum',
          title: 'Enum'
        },
        value: 3,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [3, 4, 5],
        operator: 2,
        observers: []
      },
      {
        id: 13,
        title: 'Image',
        variant: {
          ident: 'image',
          title: 'RGB Image'
        },
        value: {
          width: 200,
          height: 300,
          values: null,
        },
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      },
      {
        id: 14,
        title: 'Active property',
        variant: {
          ident: 'bool',
          title: 'Bool'
        },
        value: true,
        minimum: 0,
        maximum: 0,
        rows: 0,
        cols: 0,
        state: 'current',
        access: 'full',
        behavior: 'persistent',
        descriptions: [],
        operator: 4,
        observers: []
      }
    ]});
  });
  parametersRouter.put('/', function(req, res) {
    res.send('null');
  });
  app.use('/api/parameters/*', parametersRouter);
};
