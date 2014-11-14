import DS from "ember-data";

import ObserverModel from 'stromx-web/models/observer';

var InputObserver = ObserverModel.extend({
  input: DS.belongsTo('input', {async: true}),
  value: DS.belongsTo('connector-value', {async: true}),
});

InputObserver.reopenClass({
  FIXTURES: [
    {
      id: 0,
      zvalue: 2,
      visualization: 'lines',
      color: '#0000ff',
      input: 1,
      value: 0,
      view: 1
    },
    {
      id: 2,
      zvalue: 1,
      visualization: 'image',
      color: '#00ff00',
      input: 2,
      value: 1,
      view: 1
    },
    {
      id: 3,
      zvalue: 4,
      visualization: 'default',
      color: '#ff0000',
      input: 2,
      value: 2,
      view: 1
    }
  ]
});

export default InputObserver;
