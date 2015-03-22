module.exports = function(app) {
  var express = require('express');
  var inputObserversRouter = express.Router();
  inputObserversRouter.get('/', function(req, res) {
    res.send({"input-observers": [
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
      },
      {
        id: 4,
        zvalue: 5,
        visualization: 'polygons',
        properties: {
          color: '#00ff00'
        },
        input: 1,
        value: 3,
        view: 1
      }
    ]});
  });
  inputObserversRouter.post('/', function(req, res) {
    res.send({
      "input-observer": { id: 4 }
    });
  });
  inputObserversRouter.put('/', function(req, res) {
    res.send('null');
  });
  inputObserversRouter.delete('/', function(req, res) {
    res.send('null');
  });
  app.use('/api/inputObservers', inputObserversRouter);
  app.use('/api/inputObservers/*', inputObserversRouter);
};
