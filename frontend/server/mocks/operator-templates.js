module.exports = function(app) {
  var express = require('express');
  var operatorTemplatesRouter = express.Router();
  operatorTemplatesRouter.get('/', function(req, res) {
    res.send({"operator-templates":[
      {
        id: 0,
        type: 'Counter',
        package: 'runtime',
        version: '0.3.0'
      },
      {
        id: 1,
        type: 'Send',
        package: 'runtime',
        version: '0.3.0'
      },
      {
        id: 4,
        type: 'Test',
        package: 'mypackage',
        version: '0.0.1'
      }
    ]});
  });
  app.use('/api/operatorTemplates', operatorTemplatesRouter);
};
