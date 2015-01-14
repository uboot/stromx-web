module.exports = function(app) {
  var express = require('express');
  var outputsRouter = express.Router();
  outputsRouter.get('/', function(req, res) {
    res.send({"outputs":[
      {
        id: 4,
        title: 'Output image',
        operator: 2,
        connections: [],
        variant: { 
          ident: 'image',
          title: 'Mono image 8-bit'
        }
      },
      {
        id: 5,
        title: 'Generated number',
        operator: 0,
        connections: [1, 2],
        variant: { 
          ident: 'int',
          title: 'UInt32'
        }
      },
      {
        id: 6,
        title: 'Received image',
        operator: 3,
        connections: [],
        variant: { 
          ident: 'image',
          title: 'RGB image 24-bit'
        }
      }
    ]});
  });
  app.use('/api/outputs/*', outputsRouter);
};
