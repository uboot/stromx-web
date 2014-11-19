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
          x: 20,
          y: 20
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
          x: 160,
          y: 40
        },
        inputs: [2],
        outputs: [],
        stream: 2
      },
      {
        id: 2,
        name: 'Blur the image',
        status: 'none',
        type: 'Blur',
        package: 'cv::imgproc',
        version: '0.0.1',
        parameters: [2, 3, 4, 6, 7, 12],
        position: {
          x: 240,
          y: 40
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
          x: 40,
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
          x: 120,
          y: 160
        },
        inputs: [],
        outputs: [],
        stream: 2
      }
    ]});
  });
  app.use('/api/operators/*', operatorsRouter);
};
