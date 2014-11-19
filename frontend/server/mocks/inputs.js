module.exports = function(app) {
  var express = require('express');
  var inputsRouter = express.Router();
  inputsRouter.get('/', function(req, res) {
    res.send({"inputs":[
      {
        id: 1,
        title: 'Input image',
        operator: 2,
        connection: null,
        observers: [0]
      },
      {
        id: 2,
        title: 'Number',
        operator: 1,
        connection: 1,
        observers: [2, 3]
      },
      {
        id: 3,
        title: 'Destination image',
        operator: 2,
        connection: 2,
        observers: []
      }
    ]});
  });
  app.use('/api/inputs/*', inputsRouter);
};
