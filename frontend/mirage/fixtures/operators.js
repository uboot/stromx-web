export default [
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
      y: 75
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
      y: 100
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
      y: 100
    },
    inputs: [1, 3],
    outputs: [4],
    stream: 2
  },
  {
    id: 3,
    name: 'Some operator',
    status: 'none',
    type: 'Operator type',
    package: 'runtime',
    version: '0.0.1',
    parameters: [5],
    position: {
      x: 50,
      y: 100
    },
    inputs: [4],
    outputs: [6],
    stream: 3
  },
  {
    id: 4,
    name: 'Test operator',
    status: 'none',
    type: 'Test',
    package: 'mypackage',
    version: '0.0.1',
    parameters: [8, 9, 10, 11, 14, 13, 15, 16, 17],
    position: {
      x: 125,
      y: 200
    },
    inputs: [],
    outputs: [],
    stream: 2
  },
  {
    id: 6,
    name: 'Description types',
    status: 'initialized',
    type: 'DescriptionTypes',
    package: 'mypackage',
    version: '0.0.1',
    parameters: [18, 19, 20],
    position: {
      x: 200,
      y: 100
    },
    inputs: [5],
    outputs: [7],
    stream: 3
  }
];
