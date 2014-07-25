/* global App */

App.View = DS.Model.extend({
  name: DS.attr('string'),
  observers: DS.hasMany('observer', {async: true,  polymorphic: true })
});

App.View.FIXTURES = [
  {
    id: 1,
    name: 'Main observer',
    observers: [
      {
        id: 0,
        type: "connectorObserver"
      },
      {
        id: 2,
        type: "connectorObserver"
      },
      {
        id: 0,
        type: "parameterObserver"
      }
    ]
  }
];
