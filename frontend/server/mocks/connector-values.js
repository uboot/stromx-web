module.exports = function(app) {
  var express = require('express');
  var connectorValuesRouter = express.Router();
  connectorValuesRouter.get('/', function(req, res) {
    res.send({"connector-values":[
      {
        id: 0,
        variant: {
          ident: 'matrix'
        },
        value: {
          rows: 3,
          cols: 4,
          values: [
            [10, 10, 200, 200],
            [10, 20, 200, 300],
            [10, 30, 200, 400]
          ]
        }
      },
      {
        id: 1,
        variant: {
          ident: 'image'
        },
        value: {
          width: 200,
          height: 204,
          values: (
          'data:image/jpeg;base64,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'
        )}
      },
      {
        id: 2,
        variant: {
          ident: 'float'
        },
        value: 123.56
      }
    ]});
  });
  app.use('/api/connectorValues/*', connectorValuesRouter);
};
