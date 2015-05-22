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
        observers: [0, 4],
        variant: {
          ident: 'image',
          title: 'Mono image 8-bit'
        }
      },
      {
        id: 2,
        title: 'Number',
        operator: 1,
        connection: 1,
        observers: [2, 3],
        variant: {
          ident: 'int',
          title: 'Int32'
        }
      },
      {
        id: 3,
        title: 'Destination image',
        operator: 2,
        connection: 2,
        observers: [],
        variant: {
          ident: 'image',
          title: 'Mono image 8-bit'
        }
      },
      {
        id: 4,
        title: 'Some input',
        operator: 3,
        connection: null,
        observers: [],
        variant: {
          ident: 'image',
          title: 'Mono image 8-bit'
        }
      }
    ]});
  });
  app.use('/api/inputs/*', inputsRouter);
};
