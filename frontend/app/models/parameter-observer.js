import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

var ParameterObserver = Observer.extend({
  parameter: DS.belongsTo('parameter', {async: true})
});


ParameterObserver.reopenClass({
  FIXTURES: [
    {
      id: 0,
      zvalue: 3,
      visualization: 'slider',
      color: '#000000',
      parameter: 3,
      view: 1
    }
  ]
});

export default ParameterObserver;
