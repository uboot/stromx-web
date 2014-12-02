module.exports = function(app) {
  var express = require('express');
  var inputObserversRouter = express.Router();
  inputObserversRouter.get('/', function(req, res) {
    res.send({"input-observers":[
      {
        id: 0,
        zvalue: 2,
        visualization: 'line_segments',
        properties: {
          color: '#0000ff'
        },
        input: 1,
        value: 0,
        view: 1
      },
      {
        id: 2,
        zvalue: 1,
        visualization: 'image_2d',
        properties: {
          color: '#00ff00'
        },
        input: 2,
        value: 1,
        view: 1
      },
      {
        id: 3,
        zvalue: 4,
        visualization: 'default',
        properties: {
          color: '#ff0000'
        },
        input: 2,
        value: 2,
        view: 1
      }
    ]});
  });
  app.use('/api/inputObservers/*', inputObserversRouter);
};
