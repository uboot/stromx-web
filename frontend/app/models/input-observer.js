import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

export default Observer.extend({
  input: DS.belongsTo('input', {async: true}),
  value: DS.belongsTo('connector-value', {async: true}),

  title: function() {
    var input = this.get('input');
    var name = input.get('operator.name');
    var title = input.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('input.title', 'input.operator.name')
});
