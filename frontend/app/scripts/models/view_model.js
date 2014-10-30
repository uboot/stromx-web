/* global App */

App.View = DS.Model.extend({
  name: DS.attr('string'),
  observers: DS.hasMany('observer', {async: true,  polymorphic: true }),
  stream: DS.belongsTo('stream', {async: true})
});

App.View.FIXTURES = [
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
        type: 'inputObserver'
      }
    ],
    stream: 2
  }
];
