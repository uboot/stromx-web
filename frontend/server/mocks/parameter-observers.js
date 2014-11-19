module.exports = function(app) {
  var express = require('express');
  var parameterObserversRouter = express.Router();
  parameterObserversRouter.get('/', function(req, res) {
    res.send({"parameter-observers":[
      {
        id: 0,
        zvalue: 3,
        visualization: 'slider',
        color: '#000000',
        parameter: 3,
        view: 1
      }
    ]});
  });
  app.use('/api/parameterObservers/*', parameterObserversRouter);
};
