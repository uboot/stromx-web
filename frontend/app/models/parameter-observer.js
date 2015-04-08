import DS from "ember-data";

import Observer from 'stromx-web/models/observer';

export default Observer.extend({
  parameter: DS.belongsTo('parameter', {async: true}),

  title: function() {
    var parameter = this.get('parameter');
    var name = parameter.get('operator.name');
    var title = parameter.get('title');
    if (name) {
      title += " at " + name;
    }

    return title;
  }.property('parameter.title', 'parameter.operator.name')
});
