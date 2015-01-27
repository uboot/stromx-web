module.exports = function(app) {
  var express = require('express');
  var operatorsRouter = express.Router();
  operatorsRouter.get('/', function(req, res) {
    res.send({"operators":[
      {
        id: 0,
        name: 'Generate numbers',
        status: 'initialized',
        type: 'Counter',
        package: 'runtime',
        version: '0.3.0',
        parameters: [],
        position: {
          x: 25,
          y: 25
        },
        inputs: [],
        outputs: [5],
        stream: 2
      },
      {
        id: 1,
        name: 'Send numbers',
        status: 'initialized',
        type: 'Send',
        package: 'runtime',
        version: '0.3.0',
        parameters: [1],
        position: {
          x: 150,
          y: 50
        },
        inputs: [2],
        outputs: [],
        stream: 2
      },
      {
        id: 2,
        name: 'Blur the image',
        status: 'initialized',
        type: 'Blur',
        package: 'cv::imgproc',
        version: '0.0.1',
        parameters: [2, 3, 4, 6, 7, 12],
        position: {
          x: 250,
          y: 50
        },
        inputs: [1, 3],
        outputs: [4],
        stream: 2
      },
      {
        id: 3,
        name: 'Receive remote images',
        status: 'none',
        type: 'Receive',
        package: 'runtime',
        version: '0.0.1',
        parameters: [5],
        position: {
          x: 50,
          y: 100
        },
        inputs: [],
        outputs: [6],
        stream: null
      },
      {
        id: 4,
        name: 'Test operator',
        status: 'none',
        type: 'Test',
        package: 'mypackage',
        version: '0.0.1',
        parameters: [8, 9, 10, 11],
        position: {
          x: 125,
          y: 150
        },
        inputs: [],
        outputs: [],
        stream: 2
      }
    ]});
  });
  operatorsRouter.post('/', function(req, res) {
    res.send({
      'operator': { id: 5 }
    });
  });
  app.use('/api/operators', operatorsRouter);
  app.use('/api/operators/*', operatorsRouter);
};
