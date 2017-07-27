export default [
  {
    id: 4,
    title: 'Output image',
    operator: 2,
    connections: [],
    observers: [3],
    variant: {
      ident: 'image',
      title: 'Mono image 8-bit'
    },
    behavior: 'persistent',
    currentType: 'output'
  },
  {
    id: 5,
    title: 'Generated number',
    operator: 0,
    connections: [1, 2],
    observers: [4, 5, 6, 7],
    variant: {
      ident: 'int',
      title: 'UInt32'
    },
    behavior: 'persistent',
    currentType: 'output'
  },
  {
    id: 6,
    title: 'Received image',
    operator: 3,
    connections: [],
    observers: [],
    variant: {
      ident: 'image',
      title: 'RGB image 24-bit'
    },
    behavior: 'persistent',
    currentType: 'output'
  },
  {
    id: 7,
    title: 'Output',
    operator: 6,
    connection: null,
    observers: [],
    variant: {
      ident: 'int',
      title: 'Int32'
    },
    behavior: 'persistent',
    currentType: 'output'
  }
];
