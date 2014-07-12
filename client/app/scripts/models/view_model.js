/* global App */

App.View = DS.Model.extend({
  name: DS.attr('string'),
  connectorObservers: DS.hasMany('connectorObservers', {async: true}),
  parameterObservers: DS.hasMany('parameterObservers', {async: true})
});

App.View.FIXTURES = [
  {
    id: 1,
    name: 'Main observer',
    connectorObservers: [0, 2],
    parameterObservers: [0]
  }
];
