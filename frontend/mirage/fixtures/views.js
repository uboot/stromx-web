export default [
  {
    id: 1,
    name: 'Main view',
    observers: [
      {
        id: 0,
        type: 'inputObserver'
      },
      {
        id: 2,
        type: 'inputObserver'
      },
      {
        id: 0,
        type: 'parameterObserver'
      },
      {
        id: 3,
        type: 'outputObserver'
      },
      {
        id: 4,
        type: 'outputObserver'
      },
      {
        id: 4,
        type: 'inputObserver'
      }
    ],
    stream: 2
  },
  {
    id: 2,
    name: 'Second view',
    observers: [
      {
        id: 3,
        type: 'inputObserver'
      },
      {
        id: 5,
        type: 'outputObserver'
      },
      {
        id: 6,
        type: 'outputObserver'
      },
      {
        id: 7,
        type: 'outputObserver'
      }
    ],
    stream: 2
  }
];
