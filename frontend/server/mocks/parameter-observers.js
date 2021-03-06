module.exports = function(app) {
  var express = require('express');
  var parameterObserversRouter = express.Router();
  parameterObserversRouter.get('/', function(req, res) {
    res.send({"parameter-observers":[
      {
        id: 0,
        zvalue: 2,
        visualization: 'value',
        visualizations: ['value', 'slider'],
        properties: {
          color: '#000000',
          position: 'top'
        },
        parameter: 3,
        view: 1
      }
    ]});
  });
  parameterObserversRouter.put('/', function(req, res) {
    res.send('null');
  });
  parameterObserversRouter.delete('/', function(req, res) {
    res.send('null');
  });
  app.use('/api/parameterObservers/*', parameterObserversRouter);
};
