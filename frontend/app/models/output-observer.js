import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

export default Observer.extend({
  output: DS.belongsTo('output', {async: true}),
  value: DS.belongsTo('connector-value', {async: true}),

  title: function() {
    var output = this.get('output');
    var name = output.get('operator.name');
    var title = output.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('output.title', 'output.operator.name')
});
